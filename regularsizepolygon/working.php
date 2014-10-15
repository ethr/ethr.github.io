<html>
<head>
<title>Area workings</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>

<body>
<div>The Number of sides = <?php echo $_POST["n"] ?> </div>
<div>The Perimeter = <?php echo $_POST["p"] ?></div>
<div>A = 360/(2n)  = <?php echo 360/($_POST["n"]*2) ?></div>
<div>Each side (C) = <?php echo $_POST["p"]/$_POST["n"] ?></div>
<div>B (C/2) = <?php echo ($_POST["p"]/$_POST["n"])/2 ?></div>
<div>The Height of each section (h) = B/tanA = <?php echo (($_POST["p"]/2)/($_POST["n"])/tan(deg2rad(180/$_POST["n"]))) ?></div>
<div>The Area of each section is h*C/2 = <?php echo (($_POST["p"]/2)/($_POST["n"])/tan(deg2rad(180/$_POST["n"])))*$_POST["p"]/$_POST["n"] ?></div>
<div>However we do not need to divide by 2 and times by n we can simply have (h*c)*(n/2) as the shape repeats itself anyway.</div>
<div>The formular for the whole shape is: (h*c)*(n/2). However, only knowing N and the perimeter means we have to subsitute values for H and C.</div>
<div>So the Area of the shape is worked out by this formular : (((P/2)/N)/(tan(180/N)*(P/N)*(N/2)</div>
<div>The Area of the polygon = <?php echo ((($_POST["p"]/2)/($_POST["n"])/tan(deg2rad(180/$_POST["n"])))*($_POST["p"]/$_POST["n"]))*($_POST["n"]/2) ?></div>
<br>
<p>This page was made by Joshua England please respect the time and effort that was given to making it.</p>
</html>
