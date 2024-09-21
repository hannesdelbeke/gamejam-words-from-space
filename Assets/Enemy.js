#pragma strict

var WeaknessWord : String = "test" ;
var speed : float = 0.1f ;
var width : float = 1;
var dmg : int = 25 ;
var points : int = 5;
public var guiSkin : GUISkin;
var getShot : AudioClip;
var hitPlanet : AudioClip;

/*
var startPos : Vector3;
function Awake()
{
	startPos = transform.position;
	print(startPos);
}*/

function Update () {

}
function OnGUI() // its OnGUI not OnGui !!! (stupid mistake)
{
			 GUI.skin = guiSkin;
			var screenPosition = Camera.main.WorldToScreenPoint(transform.position);		
			GUI.Label (Rect (screenPosition.x-WeaknessWord.Length/2*10, Screen.height - screenPosition.y +20, 96, 64), WeaknessWord);
}
function Die(awardPoints)
{
	if(awardPoints){
		AudioSource.PlayClipAtPoint(getShot, Camera.main.transform.position);}
	else{
		AudioSource.PlayClipAtPoint(hitPlanet, Camera.main.transform.position);
	}
	Destroy (gameObject);
}
