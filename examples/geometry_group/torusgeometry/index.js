import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
const gui = new GUI()
const geoConfig = {
  radius: 1,
  tube: .4,
  radialSegments: 8,
  tubelarSegments: 6,
  arc: Math.PI * 2
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

  const geo = new THREE.TorusGeometry(
    geoConfig.radius,
    geoConfig.tube,
    geoConfig.radialSegments,
    geoConfig.tubelarSegments,
    geoConfig.arc
  )

  const mat = new THREE.MeshNormalMaterial({wireframe: true})
  mat.side = THREE.DoubleSide
  const mesh = new THREE.Mesh(geo,mat)
  scene.add(mesh)

  Object.keys(geoConfig).forEach( key => {
    const stepValue = key.toString().match(/Segments/) ? 1.0 : 0.01
    const minValue = key.toString().match(/arc/) ? 0.0 : 1.0
    const maxValue = key.toString().match(/arc/) ? Math.PI * 2 : key.toString().match(/Segments/) ? 100 : 10 
    gui.add( geoConfig, key.toString(), minValue, maxValue, stepValue )
      .onChange( () => {
        const newGeo = new THREE.TorusGeometry(
          geoConfig.radius,
          geoConfig.tube,
          geoConfig.radialSegments,
          geoConfig.tubelarSegments,
          geoConfig.arc
        )
        mesh.geometry.dispose()
        mesh.geometry = newGeo
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

    mesh.rotation.x += .0005
    mesh.rotation.y += .0005
    mesh.rotation.z += .0005

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
