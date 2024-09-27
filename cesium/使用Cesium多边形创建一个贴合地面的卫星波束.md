# 使用Cesium多边形创建一个贴合地面的卫星波束

复制到沙盒打开，即可实现一个利用多个多边形围成的波束，并且贴合地面
``` js
var viewer = new Cesium.Viewer('cesiumContainer', {
    //terrainProvider: Cesium.createWorldTerrain() // 加载世界地形
});

// 启用地形深度测试，确保对象贴合地形
viewer.scene.globe.depthTestAgainstTerrain = true;

// 卫星位置
var satellitePosition = Cesium.Cartesian3.fromDegrees(100, 20, 600000); // 卫星高度为2000公里

// 波束参数
var beamAngle = Cesium.Math.toRadians(70); // 波束锥角
var satelliteHeight = 600000; // 卫星高度
var earthRadius = viewer.scene.globe.ellipsoid.maximumRadius; // 地球半径

// 计算波束底部在地球表面上的投影半径
var beamBottomRadius = satelliteHeight * Math.tan(beamAngle); // 圆锥底部的半径

// 用于存储波束边缘的地表点
var positions = [];

// 定义圆的边界点数量，越多点，波束越光滑
var numPoints = 100;

// 暂时用固定高度进行测试，取消 `sampleTerrainMostDetailed`
for (var i = 0; i < numPoints; i++) {
    var angle = (2 * Math.PI * i) / numPoints;

    var latOffset = beamBottomRadius * Math.cos(angle);
    var lonOffset = beamBottomRadius * Math.sin(angle);

    // 使用固定的高度来测试是否能看到效果
    var surfacePosition = Cesium.Cartesian3.fromDegrees(
        100 + Cesium.Math.toDegrees(lonOffset / earthRadius),
        20 + Cesium.Math.toDegrees(latOffset / earthRadius),
        0 // 固定为地面高度
    );

    positions.push(surfacePosition);
}

// 为每个顶点和底部点创建三角形
for (var i = 0; i < positions.length; i++) {
    var nextIndex = (i + 1) % positions.length;

    // 创建波束斜面的多边形
    viewer.entities.add({
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy([
                satellitePosition,
                positions[i],
                positions[nextIndex]
            ]),
            material: Cesium.Color.GREEN.withAlpha(0.3), // 半透明的波束斜面
            perPositionHeight: true // 根据每个顶点的高度渲染
        }
    });
}



// 确保视角正确
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(100, 20, 10000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-60.0),
        roll: 0.0
    }
});
```


改进的版本，使用primitive API 添加的对象 ，解决大量的entity的性能损失
```js
var viewer = new Cesium.Viewer('cesiumContainer', {
    //terrainProvider: Cesium.createWorldTerrain() // 加载世界地形
});

// 启用地形深度测试，确保对象贴合地形
viewer.scene.globe.depthTestAgainstTerrain = true;

// 卫星初始位置
var satellitePosition = Cesium.Cartesian3.fromDegrees(100, 20, 600000); // 卫星高度为2000公里

// 波束参数
var beamAngle = Cesium.Math.toRadians(70); // 波束锥角
var satelliteHeight = 600000; // 卫星高度
var earthRadius = viewer.scene.globe.ellipsoid.maximumRadius; // 地球半径

// 计算波束底部在地球表面上的投影半径
var beamBottomRadius = satelliteHeight * Math.tan(beamAngle); // 圆锥底部的半径

// 用于存储波束边缘的地表点
var positions = [];

// 定义圆的边界点数量，越多点，波束越光滑
var numPoints = 100;

// 暂时用固定高度进行测试，取消 `sampleTerrainMostDetailed`
for (var i = 0; i < numPoints; i++) {
    var angle = (2 * Math.PI * i) / numPoints;

    var latOffset = beamBottomRadius * Math.cos(angle);
    var lonOffset = beamBottomRadius * Math.sin(angle);

    // 使用固定的高度来测试是否能看到效果
    var surfacePosition = Cesium.Cartesian3.fromDegrees(
        100 + Cesium.Math.toDegrees(lonOffset / earthRadius),
        20 + Cesium.Math.toDegrees(latOffset / earthRadius),
        0 // 固定为地面高度
    );

    positions.push(surfacePosition);
}

// 创建几何体实例，使用 Primitive API 构造锥体斜面
var beamGeometryInstances = [];

// 构造底部的圆锥体表面，连接每对相邻点与顶点
for (var i = 0; i < positions.length; i++) {
    var nextIndex = (i + 1) % positions.length;

    var trianglePositions = [
        satellitePosition,  // 顶点
        positions[i],       // 底部边界点1
        positions[nextIndex] // 底部边界点2
    ];

    var geometry = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(trianglePositions),
        perPositionHeight: true // 每个点根据其高度渲染
    });

    var geometryInstance = new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREEN.withAlpha(0.3))
        }
    });

    beamGeometryInstances.push(geometryInstance);
}

// 创建 Primitive 并渲染所有几何体
var beamPrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: beamGeometryInstances,
    appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: true
    })
}));


// 动态更新：用于更新锥体位置
function updateBeamPosition(newSatellitePosition) {
    // 清空原有 Primitive
    viewer.scene.primitives.remove(beamPrimitive);

    // 更新几何体顶点位置
    var updatedBeamGeometryInstances = [];

    for (var i = 0; i < positions.length; i++) {
        var nextIndex = (i + 1) % positions.length;

        var updatedTrianglePositions = [
            newSatellitePosition,
            positions[i],
            positions[nextIndex]
        ];

        var updatedGeometry = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(updatedTrianglePositions),
            perPositionHeight: true
        });

        var updatedGeometryInstance = new Cesium.GeometryInstance({
            geometry: updatedGeometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREEN.withAlpha(0.3))
            }
        });

        updatedBeamGeometryInstances.push(updatedGeometryInstance);
    }

    // 创建新的 Primitive
    beamPrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: updatedBeamGeometryInstances,
        appearance: new Cesium.PerInstanceColorAppearance({
            flat: true,
            translucent: true
        })
    }));
}

// 动态更新的示例：在2秒后更新卫星位置
setTimeout(function() {
    var newSatellitePosition = Cesium.Cartesian3.fromDegrees(101, 21, 2000000); // 更新位置
    updateBeamPosition(newSatellitePosition); // 更新波束
}, 2000);

// 确保视角正确
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(100, 20, 10000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-60.0),
        roll: 0.0
    }
});

```