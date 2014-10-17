# Linear Contour Finder
# Test for Comp3032 Coursework
# By Joshua England (je7g08@soton.ac.uk)

# Required Python Image Library (PIL)
# Tested and developed for python 2.6.6 and PIL 1.1.7 build from source for
# Ubuntu Linux 10.10 64 bit edition

import Image
import math
import ImageDraw

IMAGE_PATH = "tongue.png"
CONTOUR1_PATH = "init1.ctr"
CONTOUR2_PATH = "init2.ctr"
M = 10
N = 0
LAMBDA = 0.1

# globals
ImageObj = None
OutputImageObj = None
Contour1 = []
Contour2 = []
PixelLocations = []
IntensityValues = []
Scores = []
Contour = []

def load_image():
  """
  Loads the image specified
  """
  global ImageObj
  global OutputImageObj
  ImageObj = Image.open(IMAGE_PATH)
  OutputImageObj = ImageObj.copy()
  ImageObj = ImageObj.convert("L")

def load_contours():
  """
  Reads the contour files specified
  constructing two lists of vertex's
  """
  global N
  cfile1 = open(CONTOUR1_PATH, "r")
  for line in cfile1:
    l = line.strip().split(" ")
    x = int(float(l[0]))
    y = int(float(l[2]))
    Contour1.append((x, y))
  cfile2 = open(CONTOUR2_PATH, "r")
  for line in cfile2:
    l = line.strip().split(" ")
    x = int(float(l[0]))
    y = int(float(l[2]))
    Contour2.append((x, y))
  N = len(Contour2)

def pixels_between_points(v1, v2):
  """ Returns a list of interpolated points as if
  it was drawing a list on the screen between the two points

  Based on code from John Carter, lecturer for comp3004 Graphics
  """
  list = []
  dx = v2[0] - v1[0]
  dy = v2[1] - v1[1]
  incrN = 0
  incrEN = 0
  incrE = 0
  incrNE = 0
  y_end = 0
  x_end = 0
  Xinc = 0
  Yinc = 0
  d = 0
  if abs(dx) > abs(dy):
    if dx < 0:
      tmp = v1
      v2 = v1
      v1 = tmp
    if v2[1]>v1[1]:
      YInc = 1
    else:
      YInc = -1
    dx = abs(dx)
    dy = abs(dy)
    d = 2*dy -dx
    incrE = 2*dy
    incrEN = 2*(dy-dx)
    x_end = v2[0]
    x = v1[0]
    y = v1[1]
    list.append(x, y)
    while x < x_end:
      if d <= 0:
        d = d + incrE
        x = x + 1
      else:
        d = d + incrNE
        x = x + 1
        y = y + Yinc
      list.append((x, y))
  else:
    if dy < 0:
      tmp = v2
      v2 = v1
      v1 = tmp
    if v2[0] > v2[0]:
      Xinc = 1
    else:
      Xinc = -1
    dx = abs(dx)
    dy = abs(dy)
    d = 2*dx-dy
    incrN = 2*dx
    incrEN = 2*(dx-dy)
    y_end = v2[1]
    x = v1[0]
    y = v1[1]
    list.append((x,y))
    while y < y_end:
      if d <= 0:
        d = d + incrN
        y = y + 1
      else:
        d = d + incrEN
        y = y + 1
        x = x + Xinc
      list.append((x,y))
  return list

def load_pixellocations():
  """
  For each pair of contour points, constructs a line
  between them and divides into M segments
  """
  for i in range(len(Contour1)):
    list = []
    pixels_between = pixels_between_points(Contour1[i], Contour2[i])
    if len(pixels_between) < M:
      for i in range(1, M):
        index = i*len(pixels_between)/M
        list.append(pixels_between[index])
    else:
      division = len(pixels_between)/M
      list.append(pixels_between[0])
      for i in range(1, M):
        list.append(pixels_between[int(i*division)])
    list.append(pixels_between[-1])
    PixelLocations.append(list)

def load_intensityvalues():
  """ Generates a value between 0 and 1 for each
  pixel on the image """
  for row in PixelLocations:
    list = []
    for pixel in row:
      list.append(1- float(ImageObj.getpixel(pixel))/256)
    IntensityValues.append(list)

def magnitude(loc1, loc2):
  loc1 = PixelLocations[loc1[0]][loc1[1]]
  loc2 = PixelLocations[loc2[0]][loc2[1]]
  return math.sqrt((loc2[0] - loc1[0])**2 + (loc2[1] - loc1[1])**2)

def get_energy(loc1, loc2):
  """ Energy cost of moving from loc1 to loc2"""
  return LAMBDA*magnitude(loc1, loc2) + (1-LAMBDA)*IntensityValues[loc2[0]][loc2[1]]

def get_score(loc):
  """ """
  if loc[0] == 0:
    return 0
  return Scores[loc[0] - 1][loc[1]][0]

def gen_scores():
  """
  Applies the algorithm to generate a table of scores
  """
  for k in range(1, N):
    list = []
    for j in range (0, M):
      min = 0
      eng = 1000
      for i in range(0, M):
        e = get_score((k-1, i)) + get_energy((k-1, i), (k, j))
        if e < eng:
          min = i
          eng = e
      list.append((eng, min))
    Scores.append(list)


def gen_contour():
  """
  Generates the path for the contour by backtracking
  through the scores table
  """
  min = 0
  eng = 4000
  for i in range (0, M):
    if Scores[-1][i][0] < eng:
      eng = Scores[-1][i][0]
      min = Scores[-1][i][1]
  Contour.insert(0, PixelLocations[-1][min])
  for k in range (2, N):
    min = Scores[-k][min][1]
    Contour.insert(0, PixelLocations[-k][min])
  Contour.insert(0, PixelLocations[0][min])


def show_contour():
  """
  Shows the pixels evaluated and the contour in a new window
  """
  draw = ImageDraw.Draw(OutputImageObj)
  for list in PixelLocations:
    for pixel in list:
      i = pixel[0]
      j = pixel[1]
      draw.point((i,j), fill=128)
  for i in range(1, len(Contour)):
    draw.line(Contour[i-1] + Contour[i], fill=256)
  OutputImageObj.show()

def init():
  """
  Loads data needed
  """
  load_image()
  load_contours()
  load_pixellocations()
  load_intensityvalues()

def main():
  init()
  gen_scores()
  gen_contour()
  show_contour()

if __name__ == "__main__":
  main()
