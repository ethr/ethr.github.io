////////////////////////////////
//JS Chess JavaScript
//Writen By Joshua England
//--
//Basic conscept: swap the image of the square (blank squares are kept 'open' by a blank transparent image) if all condition
//met. Conditions include logic checks for colour, if its that player's move, moving a blank onto a piece and finally move
//validation.
//---
//Reading notes: functions start with capital letters. The main function called from the HTML code is MovePiece(sid) [where
//sid is the square id] and this in turn launches the other functions when necessary.
//---
////////////////////////////////



/*
Classes
*/

//2D Point
function Basic_2DPoint(x,y)
{
	this.x = x;
	this.y = y;
	this.pointToNumber = pointToNumber;
}

function pointToNumber()
{
	return ((this.y - 1)*8) + this.x;
}


function OppositeTeam(team){
	switch(team)
	{
		case "black":
			return "white";
		case "white":
			return "black";
		default:
			return "blank";
	}
}


var q = 0;
// osid assignment indicator
var bw = 0;
//black or white move indicator (w starts so w is 0)
var correctcolor = false;
var movevalidated = false;
var movecount = 0;
var bmovecount = 0;
var wmovecount = 0;
var piececount = 32;
var bpiececount = 16;
var wpiececount = 16;
//for counters
var osid = 64;
//sid = square id
//osid = old square id
//alt contains colour
//title contains type of piece
//blanks will have alt = title = black
function MovePiece(sid)
{
	if (q == 0)
	{
		document.getElementById(sid).className = "selected";
		osid = sid;
		q = 1;
	}
	else if (q == 1)
	{
		CorrectColor()
		MoveValidation(sid)
		switch (bw)
		{
		case 0:
		if ((TestColor(sid) == true) && (TestBlank() == true) && (correctcolor == true) && (movevalidated == true))
			{
				SwapAtts(sid)
				wmovecount = wmovecount + 1;
				bw = 1;
				document.getElementById("bwdisplay").innerHTML = "Black's Move";
			}
		break;
		case 1:
		if ((TestColor(sid) == true) && (TestBlank() == true) && (correctcolor == true) && (movevalidated == true))
			{
				SwapAtts(sid)
				bmovecount = bmovecount + 1;
				bw = 0;
				document.getElementById("bwdisplay").innerHTML = "White's Move";
			}
		break;
		default:
		alert("The game has ended");
		}
		document.getElementById(osid).className = "unselected";
		q = 0;
		osid = 64;
		Updatemoves()
		CountPieces()
	}
}

function SwapAtts(sid)
{
	document.getElementById(sid).title = document.getElementById(osid).title;
	document.getElementById(sid).src = document.getElementById(osid).src;
	document.getElementById(sid).alt = document.getElementById(osid).alt;
	document.getElementById(osid).title = "blank";
	document.getElementById(osid).alt = "blank";
	document.getElementById(osid).src = "images/blanks.gif";
}

function Updatemoves()
{
	movecount = bmovecount + wmovecount;
	document.getElementById("wmovecountdisplay").innerHTML = "White Moves: " + parseInt(wmovecount);
	document.getElementById("bmovecountdisplay").innerHTML = "Black Moves: " + parseInt(bmovecount);
	document.getElementById("movecountdisplay").innerHTML = "Total Moves: " + parseInt(movecount);
}

function TestColor(sid)
{
	if (document.getElementById(osid).alt == document.getElementById(sid).alt)
	{
		return false;
	}
	else if (document.getElementById(osid).alt != document.getElementById(sid).alt)
	{
		return true;
	}
}

function TestBlank()
{
	return document.getElementById(osid).alt != "blank";
}

function CorrectColor()
{
	correctcolor = false;
	switch (bw)
	{
	case 0:
	if (document.getElementById(osid).alt == "white")
	{
		correctcolor = true;
	}
	break;
	case 1:
	if (document.getElementById(osid).alt == "black")
	{
		correctcolor = true;
	}
	break;
	default:
	alert("The game has ended");
	}
}

function CountPieces()
{
	piececount = 0;
	bpiececount = 0;
	wpiececount = 0;
	whiteKing = 0;
	blackKing = 0;
	for(i = 0; i <= 63; i++)
	{
		if(document.getElementById(i).title == "king"){
			if (document.getElementById(i).alt == "white")
			{
				whiteKing = 1;
				wpiececount = wpiececount + 1;
			}
			else if (document.getElementById(i).alt == "black")
			{
				blackKing = 1;
				bpiececount = bpiececount + 1;
			}
			continue;
		}
		if (document.getElementById(i).alt == "white")
		{
			wpiececount = wpiececount + 1;
		}
		else if (document.getElementById(i).alt == "black")
		{
			bpiececount = bpiececount + 1;
		}
	}
	piececount = bpiececount + wpiececount;
	document.getElementById("wpiececountdisplay").innerHTML = "White pieces: " + parseInt(wpiececount);
	document.getElementById("bpiececountdisplay").innerHTML = "Black pieces: " + parseInt(bpiececount);
	document.getElementById("piececountdisplay").innerHTML = "Total pieces: " + parseInt(piececount);
	if (bpiececount == 0 || blackKing == 0)
	{
		alert("White has won!");
		bw = 100;
	}
	if (wpiececount == 0 || whiteKing == 0)
	{
		alert("Black has won!");
		bw = 100;
	}
}

/*
Selects the correct move validation to use dependant on piece
*/
function MoveValidation(sid)
{
	movevalidated = false;
	switch(document.getElementById(osid).title)
	{
		case "king":
			movevalidated = ValidateKing(sid);
		break;
		case "knight":
			movevalidated = ValidateKnight(sid);
			break;
		case "pawn":
			movevalidated = ValidatePawn(sid);
			break;
		case "castle":
			movevalidated = ValidateCastle(sid);
			break;
		case "bishop":
			movevalidated = ValidateBishop(sid);
			break;
		case "queen":
			movevalidated = (ValidateBishop(sid) || ValidateCastle(sid));
			break;
		default:
			//change to false when all Validate<piece> methods have been setup
			movevalidated = false;
			break;
	}
}

function ValidateKing(sid)
{
	if(
(sid == (osid - 9)) || (sid == (osid - 8)) || (sid == (osid - 7)) || (sid == (osid -1)) || (sid == (osid + 1)) || (sid == (osid + 7)) || (sid == (osid + 8)) || (sid == (osid + 9)))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function ValidateKnight(sid)
{
	if((sid == (osid - 6)) || (sid == (osid - 15)) || (sid == (osid +10)) || (sid == (osid +17)) || (sid == (osid + 15)) || (sid == (osid +6)) || (sid == (osid -17)) || (sid == (osid -10)))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function ValidatePawn(sid)
{
	//Tests whether piece is a white pawn moving from its starting position
	if((osid == 8) || (osid == 9) || (osid == 10) || (osid == 11) || (osid == 12) || (osid == 13) || (osid == 14) || (osid == 15))
	{
		if(((sid == (osid + 16)) || (sid == (osid + 8))) && (((document.getElementById((osid + 16)).alt == "blank"))
|| ((document.getElementById((osid + 8)).alt == "blank"))))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	//Tests whether piece is a black pawn moving from its starting position
	else if((osid == 48) || (osid == 49) || (osid == 50) || (osid == 51) || (osid == 52) || (osid == 53) || (osid == 54) || (osid == 55))
	{
		if(((sid == (osid - 16)) || (sid == (osid - 8))) && (((document.getElementById((osid - 16)).alt == "blank")) ||((document.getElementById((osid - 8)).alt == "blank"))))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	//Tests whether piece is a white and takes action to check if the piece is moving up the board onto blank square
	else if(sid == (osid + 8) && (document.getElementById(sid).alt == "blank"))
	{
		return true;
	}
	//Tests whether piece is a black and takes action to check if piece is moving up the board on blank square
	else if(sid == (osid - 8) && (document.getElementById(sid).alt == "blank"))
	{
		return true;
	}
	//Tests whether piece is a white and if there is a black piece on target square diagonally up
	else if((document.getElementById(osid).alt == "white") && (document.getElementById(sid).alt == "black") && ((sid == (osid + 9)) || (sid == (osid + 7))) )
	{
		return true;
	}
	//Tests whether piece is a black and if there is a white piece on target square diagonally up
	else if((document.getElementById(osid).alt == "black") && (document.getElementById(sid).alt == "white") && ((sid == (osid - 9)) || (sid == (osid - 7))) )
	{
		return true;
	}
	else
	{
		return false;
	}
}

function ValidateBishop(sid)
{
	//get 2d coordinate of old square
	oldSquare = new Basic_2DPoint(osid%8,Math.ceil((osid/8)));
	//get 2d coordinate of new square
	newSquare = new Basic_2DPoint(sid%8,Math.ceil((sid/8)));
	//calc dx and dy
	dx = newSquare.x - oldSquare.x;
	dy = newSquare.y - oldSquare.y;
	
	tmpS = oldSquare;
	
	//test for diagonal movement
	if(Math.abs(dx) != Math.abs(dy)){
		return false;
	}
	
	//test that theres no pieces between bishop and destination square (destination square can have an opposite colour on it)
	while(tmpS.x != newSquare.x){
		tmpS.x += (dx > 0)?1:-1;
		tmpS.y += (dy > 0)?1:-1;
		//check for piece
		if(document.getElementById(tmpS.pointToNumber()).alt != "blank"){
			//if destination square is on the opposite team
			if(tmpS.x == newSquare.x && document.getElementById(tmpS.pointToNumber()).alt == OppositeTeam(document.getElementById(osid).alt)){
				return true;
			}
			return false;
		}
	}
	
	return true;
}

function ValidateCastle(sid)
{
	return (ValidateHorz(sid) || ValidateVert(sid));
}

function ValidateHorz(sid)
{
	//get 2d coordinate of old square
	oldSquare = new Basic_2DPoint(osid%8,Math.ceil((osid/8)));
	//get 2d coordinate of new square
	newSquare = new Basic_2DPoint(sid%8,Math.ceil((sid/8)));
	//calc dx and dy
	dx = newSquare.x - oldSquare.x;
	dy = newSquare.y - oldSquare.y;
	
	tmpS = oldSquare;
	
	//test for diagonal movement
	if(dy != 0){
		return false;
	}
	
	//test that theres no pieces between bishop and destination square (destination square can have an opposite colour on it)
	while(tmpS.x != newSquare.x){
		tmpS.x += (dx > 0)?1:-1;
		//check for piece
		if(document.getElementById(tmpS.pointToNumber()).alt != "blank" || document.getElementById(tmpS.pointToNumber()).alt == document.getElementById(osid).alt ){
			//if destination square is on the opposite team
			if(tmpS.x == newSquare.x && document.getElementById(tmpS.pointToNumber()).alt == OppositeTeam(document.getElementById(osid).alt)){
				return true;
			}
			return false;
		}
	}
	
	return true;
}

function ValidateVert(sid)
{
	
	//get 2d coordinate of old square
	oldSquare = new Basic_2DPoint(osid%8,Math.ceil((osid/8)));
	//get 2d coordinate of new square
	newSquare = new Basic_2DPoint(sid%8,Math.ceil((sid/8)));
	//calc dx and dy
	dx = newSquare.x - oldSquare.x;
	dy = newSquare.y - oldSquare.y;
	
	tmpS = oldSquare;
	
	//test for diagonal movement
	if(dx != 0){
		return false;
	}
	
	//test that theres no pieces between bishop and destination square (destination square can have an opposite colour on it)
	while(tmpS.y != newSquare.y){
		tmpS.y += (dy > 0)?1:-1;
		//check for piece
		if(document.getElementById(tmpS.pointToNumber()).alt != "blank" || document.getElementById(tmpS.pointToNumber()).alt == document.getElementById(osid).alt ){
			//if destination square is on the opposite team
			if(tmpS.y == newSquare.y && document.getElementById(tmpS.pointToNumber()).alt == OppositeTeam(document.getElementById(osid).alt)){
				return true;
			}
			return false;
		}
	}
	
	return true;
}
