
// ================================================================= \\
// ==>> google is your best friend <<===                             \\
// by hannes delbeke 18/02/2013 hannesdelbeke.blogspot.com           \\
// this is not the best code, but the fastest for me to put together \\
// and if it works, the player won't notice                          \\
// ================================================================= \\

public var keyboardInput : String  ;
public var maxLength : int = 15  ; //so basicly the max length of words)

public var distFromPlayer : int = 10;
public var _player : GameObject ;
public var _playerstartlife : int = 100 ;
public var _playerlife : int = 100 ;
public var score = 0 ;

public var timer : float = 5 ;
private var _timer : float = 5 ;
private var timerDelta : float = 1 ;

public var timerIncreaseSpawnRate : float = 5 ;
private var timerIncreaseDelta : float = 1 ;

public var timerMult : float = 0.99 ; //multiplyer
public var timerDecrease : float = 0.01 ; 
public var godmode : boolean = false ;

public var guiSkin : GUISkin;
private var lost : boolean = true;
//enemy managing
 //arrays and lists in unity, always have to googlt his again, even after 50 times
   var arrayEnemies = new Array();
   var killedEnemies : int = 0; 
   var difficulty : int = 0;
   var enemyPrefab : GameObject;
   var outsideScreenDistance : int = 4;
   
  public var kongregateObj : GameObject ;
   
  //============================================================================
function Start () {}
  //============================================================================
function Update () { //main gameloop	

	if(!lost)
	{
		timerDelta -= Time.deltaTime;
		if(timerDelta<= 0 )
		{
			timerDelta = _timer;
			if (_timer<=0)
			_timer=0.1;
			
			SpawnEnemy();
	  	}
	  	
	  	
		timerDelta -= Time.deltaTime;
		if(timerIncreaseDelta <= 0 ) //so every x seconds, he decreases the tame until next spawn
		{
			_timer*=timerMult;
			_timer-=timerDecrease;
			
			timerIncreaseDelta = timerIncreaseSpawnRate ;
		}
			
	  	for (var c : char in Input.inputString) {
	  
	        // Backspace - Remove the last character
	   	    if (c == "\b"[0]) {
	            if (keyboardInput.Length != 0)
	                keyboardInput = keyboardInput.Substring(0, keyboardInput.Length - 1);
	        }
	        // End of entry
	        else if (c == "\n"[0] || c == "\r"[0]) {// "\n" for Mac, "\r" for windows.
	            print ("User entered his name: " + keyboardInput);
	        }
	        // Normal text input - just append to the end
	        else {
	               if (keyboardInput.Length >= maxLength ) 
			         {
			         	keyboardInput = keyboardInput.Substring(1, maxLength-1); //remove last letter from input
			         }
			            keyboardInput += c; //add new letter as first
	        }
	       	CheckInput();
	   //   print (keyboardInput); //print the current letters in the string
	    }
		MoveEnemy();
		if(_playerlife <= 0 && !godmode)
		{
			//gameover retry
			lost = true;
			kongregateObj.GetComponent("KongregateAPI").SubmitScore(score); //not working yet i think
		}
	}
}
  function OnGUI() { // gets called twice as much as the update
  	 GUI.skin = guiSkin;
  DrawInput();
	if(lost)
	{		
	var _widthLabel : int = 300;
	GUI.Label (new Rect (Screen.width/2-_widthLabel/2,Screen.height/2- 100,_widthLabel,30), "Score: "+ score );
	var _widthBtn : int = 300;
		if (GUI.Button(Rect(Screen.width/2-_widthBtn/2,Screen.height/2+100,_widthBtn,60),"Retry"))
		Retry();
	}	
  }
  //============================================================================
function DrawInput ()
{
 GUI.Label (new Rect (10,10,300,40), ""+keyboardInput);
 GUI.Label (new Rect (10,50,150,40), ""+ _playerlife);
 GUI.Label (new Rect (10,90,150,40), ""+ score);
 
}
  //============================================================================
function CheckInput()
{	//print(arrayEnemies);
	for (var i : int = 0; i < arrayEnemies.length  ; i++  )
	{	// 1 get list of all enemies
		
	//	print(arrayEnemies[i]);
		if(arrayEnemies[i])
		{
		var _weaknessWord : String = arrayEnemies[i].WeaknessWord ;  
		// 2 check for last letters in the input
		/*var lengthInput = keyboardInput.Length;
			_currentWord.length
		*/
		var _currentWord =arrayEnemies[i].GetComponent("Enemy").WeaknessWord ;
	
		if( keyboardInput.IndexOf(_currentWord) != -1 )
		{
			DestroyEnemy(arrayEnemies[i],i,true);
			break;
		}
		// 3 make sure you don't delete 2 enemies at same time 
		//   so go out of loop when enemy dies and reset input for next frame/tick
		
		// 3 destroy if match
		
		}
	}
}

  //============================================================================
  
function MoveEnemy()
{ 
	for (var i : int = 0; i < arrayEnemies.length  ; i++  )
	{
	arrayEnemies[i].transform.position = Vector3.Lerp (arrayEnemies[i].transform.position, _player.transform.position, arrayEnemies[i].GetComponent("Enemy").speed);
  		var dist = Vector3.Distance(arrayEnemies[i].transform.position, _player.transform.position);
		if (dist <= arrayEnemies[i].GetComponent("Enemy").width )
		{
			_playerlife-= arrayEnemies[i].GetComponent("Enemy").dmg ;
			//print ("HIT");
			DestroyEnemy(arrayEnemies[i],i,false);
		}
	}
}
  //============================================================================
function SpawnEnemy()
{	/*    
	Transform t = Instantiate(prefab, pos, rot) as Transform;
    GameObject go = t.gameObject;
    */
  	var _ScreenPos :Vector3 = new Vector3(0,0,0);
  	
    //pick random 1 side of screen (top bot left right)
	var _screenside = Random.Range(0,4);   
 
    //take width or height and create a random pos from that 
    if( _screenside ==0 )
    { 
    //print("left (width is 0)");
    	_ScreenPos.x = 0 - outsideScreenDistance;    
    	_ScreenPos.y = Random.Range(0-outsideScreenDistance,Screen.height+outsideScreenDistance);
    }
    else if( _screenside ==1 )
    {
    //print("right");
     	_ScreenPos.x = Screen.width + outsideScreenDistance; 
    	_ScreenPos.y = Random.Range(0-outsideScreenDistance,Screen.height+outsideScreenDistance);
    }
    else if( _screenside ==2 )
    {
    //print("top (height is 0)");
    	_ScreenPos.y = 0 - outsideScreenDistance; 
    	_ScreenPos.x = Random.Range(0-outsideScreenDistance,Screen.width+outsideScreenDistance);
    }
    else if( _screenside ==3 )
    {
    //print("bottom");
     	_ScreenPos.y = Screen.height + outsideScreenDistance; 
    	_ScreenPos.x = Random.Range(0-outsideScreenDistance,Screen.width+outsideScreenDistance);
    }
    _ScreenPos.z = distFromPlayer ; 
    //print(_ScreenPos);
    //screentoworld (maybe optional)
  	var _worldpos = Camera.main.ScreenToWorldPoint( _ScreenPos);
    
    //spawn
   // print (_worldpos);    
	var go : GameObject = Instantiate(enemyPrefab,_worldpos,Quaternion.identity)as GameObject;
	var _word : String = GenerateWord(5);  
	go.GetComponent("Enemy").WeaknessWord = _word ;
	  
	arrayEnemies.Push ( go ) ;
	  
}
  //============================================================================
function GenerateWord(length : int) : String 
{
//random vs pick from list (random is a good type exercise and less work, 
//list is good to train for example your languages, but more work to implement

//random 
//to add list:
//vocals in middle
//based on difficulty

 //	var chars : String = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var chars : String = "abcdefghijklmnopqrstuvwxyz";
	var returnString : String;
	 for (var i : int = 0; i<length; i++) {
		returnString+=chars[Random.Range(0, chars.Length)];
	}
	return returnString;
	
}
  //============================================================================
function IncreaseDifficulty ()
{

}
  //============================================================================
function Retry ()
{
	//message retry and score
	
	//reset score and timer
	print(arrayEnemies.length);
	var arrLength = arrayEnemies.length; //this is necesary because in destroy enemy you change the length, 
										//so the i<length also gets affected, resulting in only deleting half
	for (var i : int = 0; i <  arrLength ; i++  )
	{
		DestroyEnemy(arrayEnemies[arrLength-i-1],arrLength-i-1,false);
		print (arrLength-i);
	}
	_timer = timer;
	score = 0;
	_playerlife=_playerstartlife ;
	lost = false ;
}
  //============================================================================
  function DestroyEnemy( _enmy, _pos, awardPoints )
  {
  			//clean up
  			if(awardPoints)
			score += _enmy.GetComponent("Enemy").points ;
			
			_enmy.GetComponent("Enemy").Die(awardPoints);
			arrayEnemies.RemoveAt(_pos); //dont forget to clear from array, else nullreference }
}