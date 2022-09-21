import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
const gui = new GUI()
const geoConfig = {
  segments: 12.0,
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

  const shape = new THREE.Shape()
  shape.moveTo( 0, 0 )
  shape.lineTo( .3, 0 )
  shape.lineTo( 2, 3 )
  shape.lineTo( -2, 3 )
  shape.lineTo( -.3, 0 )
  shape.lineTo( -2, -3 )
  shape.lineTo( 2, -3 )
  shape.lineTo( .3, 0 )

  const geo = new THREE.ShapeGeometry(
    shape,
    geoConfig.segments,
  )

  const mat = new THREE.MeshNormalMaterial({wireframe: true})
  mat.side = THREE.DoubleSide
  const meshSphere = new THREE.Mesh(geo,mat)
  scene.add(meshSphere)

  Object.keys(geoConfig).forEach( key => {
    gui.add( geoConfig, key.toString(), 1, 40, 1 )
      .onChange( () => {
        const newGeo = new THREE.ShapeGeometry(
          shape,
          geoConfig.segments,
        )
        meshSphere.geometry.dispose()
        meshSphere.geometry = newGeo
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

    meshSphere.rotation.x += .0005
    meshSphere.rotation.y += .0005
    meshSphere.rotation.z += .0005

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
