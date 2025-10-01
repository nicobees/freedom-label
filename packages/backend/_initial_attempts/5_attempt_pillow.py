import PIL
from PIL import Image

# print(PIL.__version__)
# import pillow-11.3.0.dist-info
# print(Pillow.__version__)


# Location of the image
img = Image.open("img/logo.png")

# size of the image
print(img.size)

# format of the image
print(img.format)
print(img.format)
