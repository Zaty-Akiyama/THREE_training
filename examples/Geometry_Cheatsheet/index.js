import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

class createMesh
{
  constructor( args )
  {
    this.geometry = args.geometry
    this.material = args.material
    this.mesh = args.mesh
    this.target = args.target
    this.aspect = args.aspect ? args.aspect : 3/2
    this.stop = args.stop

    this.init()
  }
  init ()
  {
    if( !this.mesh )
    {
      this.mesh = new THREE.Mesh( this.geometry, this.material )
    }

    this.createField()
  }

  /**
   * @param {HTMLDivDocument} target 
   * @return {HTMLDivDocument} sceneElement
   */
  createSceneElement (target)
  {
    const sceneElement = document.createElement('div')
    sceneElement.style.width = '100%'
    sceneElement.style.height = '100%'
    
    target.prepend( sceneElement )
    return sceneElement
  }

  createField ()
  {

    this.scene = new THREE.Scene()
    this.scene.userData.element = this.createSceneElement( this.target )

    this.camera = new THREE.PerspectiveCamera( 45, this.aspect, 1, 100 )
    this.camera.position.set( 0, 0, 30 )
    this.camera.lookAt( 0, 0, 0 )
    this.scene.userData.camera = this.camera

    this.scene.add( this.mesh )

    const controls = new OrbitControls( this.scene.userData.camera, this.scene.userData.element )
    this.scene.userData.controls = controls
  }

  update(renderer)
  {
    if( !this.mesh ) return

    if( !this.stop )
    {
      this.mesh.rotation.x += .005
      this.mesh.rotation.y += .005
      this.mesh.rotation.z += .005
    }

    const element = this.scene.userData.element

    const rect = element.getBoundingClientRect()

    if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
        rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
      return
    }

    const width = rect.right - rect.left
    const height = rect.bottom - rect.top
    const left = rect.left
    const bottom = renderer.domElement.clientHeight - rect.bottom

    renderer.setViewport( left, bottom, width, height )
    renderer.setScissor( left, bottom, width, height )

    renderer.render( this.scene, this.scene.userData.camera )
  }
}

const init = () => {

  const polyhedronOpt = [
    [
      -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
      -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
    ],
    [
      2,1,0,    0,3,2,
      7,3,0,    1,2,6,    
      6,7,4,    7,6,2
    ]
  ]

  const shapes = new THREE.Shape() 
  const x=-5
  const y=-5
  shapes.moveTo( x + 5, y + 5 )
  shapes.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y )
  shapes.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 )
  shapes.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 )
  shapes.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 )
  shapes.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y )
  shapes.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 )

  const options = {
    depth: 10,
    bevelThickness: 3,
    bavelSize: 1,
  }
  const geoItemArray = document.querySelectorAll('.geoItem')
  const meshLists = [

    new createMesh( {
      geometry: new THREE.BoxGeometry(10,10,10,10,10,10), 
      material: new THREE.MeshNormalMaterial({wireframe: true}),
      target: geoItemArray[0]
    } ),

    new createMesh( {
      geometry: new THREE.PlaneGeometry(15,15,10,10),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[1]
    } ),
  
    new createMesh( {
      geometry: new THREE.SphereGeometry(10),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[2]
    } ),
  
    new createMesh( {
      geometry: new THREE.CylinderGeometry(5,5,10,10),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[3]
    } ),

    new createMesh( {
      geometry: new THREE.TorusGeometry(5,2,5,15),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[4]
    } ),

    new createMesh( {
      geometry: new THREE.TorusKnotGeometry(5,1.3),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[5]
    } ),

    new createMesh( {
      geometry: new THREE.RingGeometry(5,10,20),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[6]
    } ),

    new createMesh( {
      geometry: new THREE.PolyhedronGeometry(polyhedronOpt[0],polyhedronOpt[1],10,1),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[7]
    } ),

    new createMesh( {
      geometry: new THREE.ShapeGeometry(shapes),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[8]
    } ),

    new createMesh( {
      geometry: new THREE.ExtrudeGeometry(shapes,options),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[9]
    } ),

    new createMesh( {
      geometry: new THREE.CapsuleGeometry(15,20,4,10),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[10]
    } ),

    new createMesh( {
      geometry: new THREE.ConeGeometry(5,10,20),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[11]
    } ),

    new createMesh( {
      geometry: new THREE.DodecahedronGeometry(20,0),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[12]
    } ),

    new createMesh( {
      geometry: new THREE.IcosahedronGeometry(20,0),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[13]
    } ),

    new createMesh( {
      geometry: new THREE.OctahedronGeometry(20,0),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[14]
    } ),

    new createMesh( {
      geometry: new THREE.TetrahedronGeometry(20,0),
      material: new THREE.MeshNormalMaterial({wireframe:true}),
      target: geoItemArray[15]
    } ),
  ]
  
  meshLists[8].mesh.scale.set(.8,.8,.8)
  meshLists[9].mesh.scale.set(.5,.5,.5)
  meshLists[10].mesh.scale.set(.35,.35,.35)
  meshLists[12].mesh.scale.set(.35,.35,.35)
  meshLists[13].mesh.scale.set(.35,.35,.35)
  meshLists[14].mesh.scale.set(.35,.35,.35)
  meshLists[15].mesh.scale.set(.4,.4,.4)

  const loader = new FontLoader()
  const group = new THREE.Group()
  meshLists.push( new createMesh( {
    mesh: group,
    target: geoItemArray[16],
    aspect: 13/5,
    stop: true
  }) )
  loader.load( './helvetiker_regular.typeface.json', font => {
    const fontGeo = new TextGeometry('white-sesame.jp',{
      font: font,
      size: 3,
      height: 2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: .1,
      bevelOffset: 0,
      bevelSegments: 1  
    })
    const fontMat = new THREE.MeshNormalMaterial()
    fontMat.side = THREE.DoubleSide
    const fontMesh = new THREE.Mesh(fontGeo,fontMat)
    fontMesh.position.x = -25
    fontMesh.position.y = -4
    fontMesh.scale.set(1.7,1.7,1.7)

    group.add(fontMesh)
  })

  const canvas = document.getElementById('wrapperCanvas')
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
  })
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.outputEncoding = THREE.sRGBEncoding

  const updateSize = () => {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if( canvas.width !== width || canvas.height !== height)
    {
      renderer.setSize( width, height, false )
    }
  }

  const animate = () => {
    requestAnimationFrame( animate )
    updateSize()

    canvas.style.transform = `translateY(${window.scrollY}px)`

    renderer.setScissorTest( false )
    renderer.clear()
    renderer.setScissorTest( true )

    meshLists.forEach( item => {
      item.update(renderer)
    })
  }
  animate()
}
window.addEventListener('DOMContentLoaded', init)
