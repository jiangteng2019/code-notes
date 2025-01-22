# spring boot项目集成spring security

## 项目背景
项目使用spring boot 3.2.4 + spring security 6.2.3 + session + 前后台分离的结构。

## 项目依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

## 配置类
配置类中的java bean 非常重要，在后续的服务层，控制器均需要用到
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Resource
    private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Resource
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/login", "/api/auth/logout").permitAll()
                        .requestMatchers("/api/user/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .maximumSessions(1)
                );
        // 关闭CSRF保护
        http.csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@Nonnull CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("*").allowedHeaders("*");
            }
        };
    }
}

```

## 控制器层
使用 UsernamePasswordAuthenticationToken 校验用户凭证。登录成功后需要在SecurityContextHolder.getContext() 获取到的上下文中保存用户凭证，证明该用户已经登录。此外还需要再session中上下文信息，这一步非常重要，否则即便登录成功，也会报401未授权。

```java
@Slf4j
@RestController
@RequestMapping(value = "/api")
public class AuthController {
    @Resource
    private AuthenticationManager authenticationManager;

    @PostMapping("/auth/login")
    public CommonResult<Object> login(@RequestParam String userName, @RequestParam String password, HttpServletRequest request) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userName, password);
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
            return CommonResult.SUCCESS();
        } catch (Exception e) {
            return CommonResult.FAIL();
        }
    }

    @PostMapping("/auth/logout")
    public CommonResult<Object> logout (HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        request.getSession().invalidate();
        return CommonResult.SUCCESS();
    }
}
```

## 拦截器

拦截器主要处理未登录和权限不足的自定义响应。两者在配置类中已经导入 
```java
.exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler))
```

```java
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        PrintWriter writer = response.getWriter();
        // 创建一个json序列化工具
        ObjectMapper mapper = new ObjectMapper();
        // 写入body
        writer.println(mapper.writeValueAsString(CommonResult.FORBIDDEN()));
    }
}


@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // 不适用浏览器默认的状态码，使用自定义的状态码，浏览器状态码统一返回200
        // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        PrintWriter writer = response.getWriter();
        // 创建一个json序列化工具
        ObjectMapper mapper = new ObjectMapper();
        // 写入body
        writer.println(mapper.writeValueAsString(CommonResult.UNAUTHORIZED()));
    }
}
```
## 服务层

服务层需要实现 loadUserByUsername 方法。 passwordEncoder密码加密器作为bean注入，spring Secuirty 已经实现。
```java
@Resource
    private UserMapper userMapper;

    @Resource
    private PasswordEncoder passwordEncoder;


    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        UserEntity user = userMapper.findUserByName(userName);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new org.springframework.security.core.userdetails.User(user.getUserName(), user.getPassword(), getAuthorities(user));
    }

    private Collection<? extends GrantedAuthority> getAuthorities(UserEntity user) {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
    }

```

经过上述的整合，不出意外的话，一个spring boot和spring security的简单demo就搭建完成了。