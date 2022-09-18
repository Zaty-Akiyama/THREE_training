import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
const gui = new GUI()
const geoConfig = {
  width: 5.0, height: 5.0, depth: 5.0,
  widthSegment: 1.0,
  heightSegment: 1.0,
  depthSegment: 1.0
}
const guiConfig = {
  activeOrbit: false,
  resetWindow: () => {
    document.location.reload()
  },
}
gui.add( guiConfig, 'resetWindow' )
  .name('ページをリセット')


const init = () => {

  const width = window.innerWidth
  const height = window.innerHeight

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  document.body.appendChild(renderer.domElement)
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( width, height )
  renderer.outputEncoding = THREE.sRGBEncoding

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera( 45, width/height, .001, 1000 )
  camera.position.set( 0,0,20 )
  camera.lookAt( 0, 0, 0 )
  scene.add(camera)

  const geo = new THREE.BoxGeometry(
    geoConfig.width,
    geoConfig.height,
    geoConfig.depth,
    geoConfig.widthSegment,
    geoConfig.heightSegment,
    geoConfig.depthSegment
  )

  const mat = new THREE.MeshNormalMaterial({wireframe: true, color: 0xffffff})
  mat.side = THREE.DoubleSide
  const meshBox = new THREE.Mesh(geo,mat)
  scene.add(meshBox)

  Object.keys(geoConfig).forEach( key => {
    gui.add( geoConfig, key.toString(), 1.0, 20.0, 1.0 )
      .onChange( () => {
        const newGeo = new THREE.BoxGeometry( 
          geoConfig.width,
          geoConfig.height,
          geoConfig.depth,
          geoConfig.widthSegment,
          geoConfig.heightSegment,
          geoConfig.depthSegment
        )
        meshBox.geometry.dispose()
        meshBox.geometry = newGeo
      })
  })

  const controls = new OrbitControls( camera, renderer.domElement )
  controls.enableZoom = false
  controls.enablePan = false

  gui.add( guiConfig, 'activeOrbit' )
    .name('コントロールを有効')
    .onChange( value => {
      controls.enableZoom = value
      controls.enablePan = value
      controls.enableRotate = value
    })


  const animate = (delta) => {
    requestAnimationFrame( animate )

    meshBox.rotation.x += .0005
    meshBox.rotation.y += .0005
    meshBox.rotation.z += .0005

    controls.update()
    renderer.render( scene, camera )
  }
  animate()
  
  const onWindowResize = () => {
    const resizeWidth = window.innerWidth
    const resizeHeight = window.innerHeight
    
    camera.aspect = resizeWidth/resizeHeight
    camera.updateProjectionMatrix()
    renderer.setSize(resizeWidth,resizeHeight)
  }
  window.addEventListener('resize',onWindowResize,false)
}
init()
