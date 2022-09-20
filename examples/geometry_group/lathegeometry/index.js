import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
const gui = new GUI()
const geoConfig = {
  segments: 12,
  phiStart: 0,
  phiLength: Math.PI*2,
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
  camera.position.set( 0,0,60 )
  camera.lookAt( 0, 0, 0 )
  scene.add(camera)

  let firstPoints = []
  for (let i = 0; i < 20; i++) {
    firstPoints.push( new THREE.Vector2(i,i) )
  }

  const geo = new THREE.LatheGeometry(
    firstPoints,
    geoConfig.segments,
    geoConfig.phiStart,
    geoConfig.phiLength,
  )

  const mat = new THREE.MeshNormalMaterial({wireframe: true})
  mat.side = THREE.DoubleSide
  const mesh = new THREE.Mesh(geo,mat)
  scene.add(mesh)
  mesh.translateY(-10)

  const pointsConfig = {
    linear: () => {
      const points = []
      for (let i = 0; i < 10; i++) {
        points.push( new THREE.Vector2(i,i) )
      }
      firstPoints = points
      resetGeo()
    },
    quadratic: () => {
      const points = []
      for (let i = 0; i < 20; i++) {
        points.push( new THREE.Vector2((i*i)/15,i) )
      }
      firstPoints = points
      resetGeo()
    },
    sin: () => {
      const points = []
      for (let i = 0; i < 40; i++) {
        points.push( new THREE.Vector2(Math.sin(Math.PI/10 * i) * 6,i) )
      }
      firstPoints = points
      resetGeo()
    }
  }
  const resetGeo = () => {
    const newGeo = new THREE.LatheGeometry(
      firstPoints,
      geoConfig.segments,
      geoConfig.phiStart,
      geoConfig.phiLength,
    )
    mesh.geometry.dispose()
    mesh.geometry = newGeo
  }
  gui.add( pointsConfig, 'linear' ).name( '一時関数' )
  gui.add( pointsConfig, 'quadratic' ).name( '二次関数' )
  gui.add( pointsConfig, 'sin' ).name( 'sin関数' )

  Object.keys(geoConfig).forEach( key => {
    const stepValue = key.toString().match(/Segments/) ? 1.0 : 0.01
    const minValue = key.toString().match(/phi/) ? 0.0 : 1.0
    const maxValue = key.toString().match(/phi/) ? Math.PI*2 : 60
    gui.add( geoConfig, key.toString(), minValue, maxValue, stepValue )
      .onChange( resetGeo )
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

    mesh.rotation.x += .0003
    mesh.rotation.y += .0003
    mesh.rotation.z += .0003

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
