import os
import cv2
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from skimage.draw import draw
from glob import glob
from sklearn.preprocessing import LabelEncoder
from keras.utils.np_utils import to_categorical
from multiprocessing.dummy import Pool
from keras.models import load_model
import time
import ast
import keras
import random
import glob
import math

 #---------------------------------------------------------
 # MODEL
 #---------------------------------------------------------

from keras.layers import Conv2D, MaxPooling2D
from keras.layers import Dense, Dropout, Flatten, Activation
from keras.metrics import categorical_accuracy, top_k_categorical_accuracy, categorical_crossentropy
from keras.models import Sequential
from keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from keras.optimizers import adam_v2 as Adam    # <------------ Modificato
from keras.applications.mobilenet import MobileNet
from keras.applications.mobilenet import preprocess_input
from keras.models import load_model

# ALL_FILES = glob.glob('../input/shuffle-csvs*/*.csv.gz')
# VALIDATION_FILE = '../input/shuffle-csvs-75000-100000/train_k0.csv.gz'
# ALL_FILES.remove(VALIDATION_FILE)
INPUT_DIR = './Data'
BASE_SIZE = 256
NCATS = 340
np.random.seed(seed=1987)

AUGMENTATION = True
STEPS = 500
#BATCH_SIZE = 448
BATCH_SIZE = 6
EPOCHS = 0
LEARNING_RATE = 0.002

IMG_SHAPE = (128,128,3)
IMG_SIZE = IMG_SHAPE[0]

def apk(actual, predicted, k=3):
    """
    Source: https://github.com/benhamner/Metrics/blob/master/Python/ml_metrics/average_precision.py
    """
    if len(predicted) > k:
        predicted = predicted[:k]

    score = 0.0
    num_hits = 0.0

    for i, p in enumerate(predicted):
        if p in actual and p not in predicted[:i]:
            num_hits += 1.0
            score += num_hits / (i + 1.0)

    if not actual:
        return 0.0

    return score / min(len(actual), k)

def mapk(actual, predicted, k=3):
    """
    Source: https://github.com/benhamner/Metrics/blob/master/Python/ml_metrics/average_precision.py
    """
    return np.mean([apk(a, p, k) for a, p in zip(actual, predicted)])


def preds2catids(predictions):
    return pd.DataFrame(np.argsort(-predictions, axis=1)[:, :3], columns=['a', 'b', 'c'])

def preds2catids_1(predictions):
    return pd.DataFrame(np.argsort(-predictions, axis=1)[:, :1], columns=['a'])

def f2cat(filename: str) -> str:
    return filename.split('.')[0]

def list_all_categories():
    return ['airplane', 'alarm_clock', 'ambulance', 'angel', 'animal_migration', 'ant', 'anvil', 'apple', 'arm', 'asparagus', 'axe', 'backpack', 'banana', 'bandage', 'barn', 'baseball', 'baseball_bat', 'basket', 'basketball', 'bat', 'bathtub', 'beach', 'bear', 'beard', 'bed', 'bee', 'belt', 'bench', 'bicycle', 'binoculars', 'bird', 'birthday_cake', 'blackberry', 'blueberry', 'book', 'boomerang', 'bottlecap', 'bowtie', 'bracelet', 'brain', 'bread', 'bridge', 'broccoli', 'broom', 'bucket', 'bulldozer', 'bus', 'bush', 'butterfly', 'cactus', 'cake', 'calculator', 'calendar', 'camel', 'camera', 'camouflage', 'campfire', 'candle', 'cannon', 'canoe', 'car', 'carrot', 'castle', 'cat', 'ceiling_fan', 'cell_phone', 'cello', 'chair', 'chandelier', 'church', 'circle', 'clarinet', 'clock', 'cloud', 'coffee_cup', 'compass', 'computer', 'cookie', 'cooler', 'couch', 'cow', 'crab', 'crayon', 'crocodile', 'crown', 'cruise_ship', 'cup', 'diamond', 'dishwasher', 'diving_board', 'dog', 'dolphin', 'donut', 'door', 'dragon', 'dresser', 'drill', 'drums', 'duck', 'dumbbell', 'ear', 'elbow', 'elephant', 'envelope', 'eraser', 'eye', 'eyeglasses', 'face', 'fan', 'feather', 'fence', 'finger', 'fire_hydrant', 'fireplace', 'firetruck', 'fish', 'flamingo', 'flashlight', 'flip_flops', 'floor_lamp', 'flower', 'flying_saucer', 'foot', 'fork', 'frog', 'frying_pan', 'garden', 'garden_hose', 'giraffe', 'goatee', 'golf_club', 'grapes', 'grass', 'guitar', 'hamburger', 'hammer', 'hand', 'harp', 'hat', 'headphones', 'hedgehog', 'helicopter', 'helmet', 'hexagon', 'hockey_puck', 'hockey_stick', 'horse', 'hospital', 'hot_air_balloon', 'hot_dog', 'hot_tub', 'hourglass', 'house', 'house_plant', 'hurricane', 'ice_cream', 'jacket', 'jail', 'kangaroo', 'key', 'keyboard', 'knee', 'ladder', 'lantern', 'laptop', 'leaf', 'leg', 'light_bulb', 'lighthouse', 'lightning', 'line', 'lion', 'lipstick', 'lobster', 'lollipop', 'mailbox', 'map', 'marker', 'matches', 'megaphone', 'mermaid', 'microphone', 'microwave', 'monkey', 'moon', 'mosquito', 'motorbike', 'mountain', 'mouse', 'moustache', 'mouth', 'mug', 'mushroom', 'nail', 'necklace', 'nose', 'ocean', 'octagon', 'octopus', 'onion', 'oven', 'owl', 'paint_can', 'paintbrush', 'palm_tree', 'panda', 'pants', 'paper_clip', 'parachute', 'parrot', 'passport', 'peanut', 'pear', 'peas', 'pencil', 'penguin', 'piano', 'pickup_truck', 'picture_frame', 'pig', 'pillow', 'pineapple', 'pizza', 'pliers', 'police_car', 'pond', 'pool', 'popsicle', 'postcard', 'potato', 'power_outlet', 'purse', 'rabbit', 'raccoon', 'radio', 'rain', 'rainbow', 'rake', 'remote_control', 'rhinoceros', 'river', 'roller_coaster', 'rollerskates', 'sailboat', 'sandwich', 'saw', 'saxophone', 'school_bus', 'scissors', 'scorpion', 'screwdriver', 'sea_turtle', 'see_saw', 'shark', 'sheep', 'shoe', 'shorts', 'shovel', 'sink', 'skateboard', 'skull', 'skyscraper', 'sleeping_bag', 'smiley_face', 'snail', 'snake', 'snorkel', 'snowflake', 'snowman', 'soccer_ball', 'sock', 'speedboat', 'spider', 'spoon', 'spreadsheet', 'square', 'squiggle', 'squirrel', 'stairs', 'star', 'steak', 'stereo', 'stethoscope', 'stitches', 'stop_sign', 'stove', 'strawberry', 'streetlight', 'string_bean', 'submarine', 'suitcase', 'sun', 'swan', 'sweater', 'swing_set', 'sword', 't-shirt', 'table', 'teapot', 'teddy-bear', 'telephone', 'television', 'tennis_racquet', 'tent', 'the_eiffel_tower', 'the_great_wall_of_china', 'the_mona_lisa', 'tiger', 'toaster', 'toe', 'toilet', 'tooth', 'toothbrush', 'toothpaste', 'tornado', 'tractor', 'traffic_light', 'train', 'tree', 'triangle', 'trombone', 'truck', 'trumpet', 'umbrella', 'underwear', 'van', 'vase', 'violin', 'washing_machine', 'watermelon', 'waterslide', 'whale', 'wheel', 'windmill', 'wine_bottle', 'wine_glass', 'wristwatch', 'yoga', 'zebra', 'zigzag']


def plot_batch(x):    
    cols = 4
    rows = 6
    fig, axs = plt.subplots(nrows=rows, ncols=cols, sharex=True, sharey=True, figsize=(18, 18))
    for i in range(rows):
        for k in range(0,3):
            ax = axs[i, k]
            ax.imshow(x[i, :, :, k], cmap=plt.cm.gray)
            ax.axis('off')
        ax = axs[i, 3]
        ax.imshow(x[i, :, :], )
        ax.axis('off')
    fig.tight_layout()
    #plt.show();

def plot_imgs(x, num_imgs = 1):
    cols = 4
    rows = num_imgs
    fig, axs = plt.subplots(nrows=rows, ncols=cols, sharex=True, sharey=True, figsize=(18, 18))
    if(rows > 1):
        for i in range(rows):
            for k in range(0,3):
                ax = axs[i, k]
                ax.imshow(x[i, :, :, k], cmap=plt.cm.gray)
                ax.axis('off')
            ax = axs[i, 3]
            ax.imshow(x[i, :, :], )
            ax.axis('off')
        fig.tight_layout()
    else:
        for k in range(0,3):
            ax = axs[k]
            ax.imshow(x[ :, :, k], cmap=plt.cm.gray)
            ax.axis('off')
        ax = axs[3]
        ax.imshow(x[:, :], )
        ax.axis('off')
        fig.tight_layout()
    #plt.show();

def draw_cv2(raw_strokes, size=256, lw=6, augmentation = False):
    img = np.zeros((BASE_SIZE, BASE_SIZE, 3), np.uint8)
    for t, stroke in enumerate(raw_strokes):
        points_count = len(stroke[0]) - 1
        grad = 255//points_count
        for i in range(len(stroke[0]) - 1):
            _ = cv2.line(img, (stroke[0][i], stroke[1][i]), (stroke[0][i + 1], stroke[1][i + 1]), (255, 255 - min(t,10)*13, max(255 - grad*i, 20)), lw)
    if size != BASE_SIZE:
        img = cv2.resize(img, (size, size))
    if augmentation:
        if random.random() > 0.5:
            img = np.fliplr(img)
    return img

def top_3_accuracy(y_true, y_pred):
    return keras.metrics.top_k_categorical_accuracy(y_true, y_pred, k=3)


def image_generator(size, batchsize, lw=6, augmentation = False):
    while True:
        #for filename in ALL_FILES:
        for filename in [testfile, ]:
            for df in pd.read_csv(filename, chunksize=batchsize):
                df['drawing'] = df['drawing'].apply(eval)
                x = np.zeros((len(df), size, size,3))
                for i, raw_strokes in enumerate(df.drawing.values):
                    x[i] = draw_cv2(raw_strokes, size=size, lw=lw, augmentation = augmentation)
                x = x / 255.
                x = x.reshape((len(df), size, size, 3)).astype(np.float32)
                y = 1#to_categorical(df.y, num_classes=NCATS)
                yield x, y

model = load_model('./mobileNet.hdf5', custom_objects = {'top_3_accuracy':top_3_accuracy})
testfile = "./Data/test_simplified.csv"

def old_main():
    datagen = image_generator(size=IMG_SIZE, batchsize=BATCH_SIZE, augmentation = AUGMENTATION)



    x,y = next(datagen)

    plt.close("all")
    plt.figure()
    plot_batch(x)


    print("K\n\n")

    preds = model.predict(x)

    cats = list_all_categories()
    id2cat = {k: cat.replace(' ', '_') for k, cat in enumerate(cats)}
    top3 = preds2catids(preds)
    top3cats = top3.replace(id2cat)
    # submission_df['word'] = top3cats['a'] + ' ' + top3cats['b'] + ' ' + top3cats['c']
    # submission = submission_df[['key_id', 'word']]


    print(top3cats['a'] + ' ' + top3cats['b'] + ' ' + top3cats['c'])

    plt.show()

def test_img(arr):
    img = draw_cv2(arr, size=128, lw=3, augmentation=False)

    plot_imgs(img)

    x = np.expand_dims(img, 0)

    preds = model.predict(x)

    cats = list_all_categories()
    #print(f"{cats=}")
    id2cat = {k: cat.replace(' ', '_') for k, cat in enumerate(cats)}
    top3 = preds2catids(preds)
    top3cats = top3.replace(id2cat)

    print(top3cats['a'] + ' ' + top3cats['b'] + ' ' + top3cats['c'])

    plt.show()

def test(arr):
    img = draw_cv2(arr, size=128, lw=3, augmentation=False)

    #plot_imgs(img)
    #plt.show()
    
    x = np.expand_dims(img, 0)
    preds = model.predict(x)

    cats = list_all_categories()
    id2cat = {k: cat.replace(' ', '_') for k, cat in enumerate(cats)}
    top3 = preds2catids_1(preds)
    top3cats = np.asarray([top3.replace(id2cat)])

    #top3cats = np.asarray([id2cat[z] for z in top3])
    response = top3cats[0]
    print(response)
    return response

    

def main():

    img1 = [[[32, 32, 31, 31, 31, 31, 30, 30, 30, 29, 29, 28, 28, 28, 28, 28, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 27, 26, 25, 24, 24, 23, 23, 23, 22, 22, 22, 22, 22, 21, 21, 21, 20, 20, 20, 20, 20, 20, 20, 20, 19, 18, 18, 18, 17, 17, 17, 18, 19, 20, 23, 25, 26, 28, 29, 31, 33, 35, 40, 42, 45, 48, 51, 54, 56, 59, 63, 66, 67, 71, 74, 77, 80, 87, 90, 94, 97, 101, 104, 107, 110, 115, 118, 120, 123, 126, 130, 133, 137, 141, 143, 145, 147, 148, 150, 151, 153, 156, 157, 159, 161, 163, 165, 167, 171, 172, 174, 176, 177, 178, 179, 180, 182, 183, 184, 185, 186, 186, 187, 188, 189, 189, 190, 191, 192, 193, 194, 196, 198, 199, 200, 201, 203, 204, 205, 206, 206, 206, 206, 207, 207, 208, 209, 210, 210, 211, 212, 213, 214, 214, 215, 216, 217, 217, 217, 218, 218, 219, 219, 220, 221, 221, 221, 222, 222, 223, 223, 223, 223, 223, 223, 223, 223, 223, 223, 224, 224, 224, 224, 224, 225, 225, 225, 225, 226, 226, 226, 227, 227, 228, 228, 228, 229, 230, 231, 231, 231, 231, 232, 232, 232, 233, 233, 233, 233, 233, 233, 233, 233, 233, 233, 233, 233, 233, 232, 232, 232, 232, 232, 232, 232, 232, 232, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 232, 232, 232, 232, 233, 233, 233, 233, 233, 232, 232, 231, 229, 227, 225, 221, 219, 217, 214, 210, 208, 204, 200, 196, 192, 189, 186, 184, 181, 179, 175, 173, 171, 169, 168, 166, 165, 164, 162, 161, 160, 159, 158, 157, 155, 152, 150, 148, 146, 144, 141, 139, 136, 130, 127, 124, 120, 118, 115, 111, 108, 102, 100, 96, 93, 91, 88, 86, 83, 81, 79, 78, 76, 74, 73, 71, 69, 68, 67, 66, 64, 63, 61, 60, 56, 54, 52, 50, 49, 48, 47, 45, 43, 42, 41, 40, 40, 39, 39, 37, 37, 36, 35, 35, 34, 33, 32, 32, 31, 31, 31, 31, 30, 29], [51, 52, 53, 54, 55, 57, 58, 58, 59, 60, 62, 65, 66, 68, 70, 71, 72, 73, 75, 77, 79, 81, 82, 84, 85, 86, 87, 89, 89, 90, 91, 93, 93, 95, 96, 97, 97, 98, 99, 100, 100, 101, 103, 104, 105, 106, 107, 108, 108, 109, 110, 111, 112, 114, 116, 118, 120, 120, 121, 121, 122, 122, 122, 123, 125, 126, 129, 130, 130, 131, 133, 133, 133, 134, 134, 135, 137, 139, 141, 143, 144, 145, 145, 145, 145, 145, 145, 146, 146, 147, 147, 148, 148, 149, 149, 150, 150, 151, 152, 152, 152, 152, 153, 153, 153, 153, 154, 154, 155, 156, 156, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 156, 156, 156, 156, 156, 156, 156, 156, 156, 156, 156, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 152, 152, 152, 152, 152, 151, 151, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 149, 149, 149, 148, 148, 148, 148, 147, 146, 145, 144, 141, 139, 137, 134, 131, 129, 126, 123, 119, 116, 114, 112, 109, 108, 105, 103, 101, 101, 99, 98, 96, 94, 93, 90, 89, 87, 85, 84, 82, 81, 81, 79, 79, 79, 78, 78, 77, 76, 75, 73, 71, 70, 68, 67, 66, 65, 64, 64, 63, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 52, 51, 50, 50, 49, 49, 49, 50, 50, 50, 51, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 53, 53, 53, 53, 53, 53, 52, 52, 52, 52, 52, 52, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 50, 50, 50, 49, 49, 49, 49, 49, 48, 48, 48, 48, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47]], [[37, 37, 38, 38, 39, 39, 40, 40, 41, 42, 42, 43, 43, 44, 44, 45, 46, 46, 46, 46, 47, 47, 48, 48, 49, 49, 49, 50, 50, 51, 51, 52, 53, 53, 53, 53, 54, 54, 54, 54, 55, 55, 55, 56, 56, 56, 56, 57, 57, 58, 58, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 58, 58, 57, 57, 56, 56, 56, 56, 55, 55, 55, 54, 54, 54, 54, 53, 53, 52, 52, 51, 51, 50, 50, 49, 48, 48, 47, 46, 46, 46, 45, 45, 45, 44, 44, 44, 43, 43, 43, 42, 42, 41, 41, 40, 40, 39, 39, 39, 39, 39, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 40, 40, 41, 41, 42, 42, 43, 44, 45, 46, 46, 47, 47, 48, 48, 49, 49, 50, 51, 51, 51, 52, 52, 53, 54, 54, 54, 55, 56, 56, 56, 57, 57, 58, 58, 58, 59, 59, 59], [116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115, 114, 114, 114, 114, 114, 113, 113, 112, 112, 112, 111, 111, 111, 110, 110, 110, 110, 109, 109, 109, 108, 108, 108, 108, 107, 107, 107, 106, 105, 105, 104, 104, 104, 103, 103, 102, 102, 101, 101, 100, 100, 99, 99, 98, 97, 97, 97, 96, 95, 94, 94, 93, 92, 92, 92, 92, 91, 91, 91, 91, 91, 91, 91, 91, 90, 90, 90, 89, 89, 89, 89, 89, 88, 88, 87, 87, 86, 86, 86, 85, 84, 84, 83, 82, 81, 81, 80, 79, 78, 78, 77, 77, 76, 75, 75, 75, 75, 74, 74, 74, 73, 73, 73, 72, 71, 71, 71, 71, 71, 70, 70, 70, 69, 69, 69, 69, 69, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67]], [[84, 83, 82, 82, 82, 81, 81, 80, 80, 79, 79, 78, 78, 78, 77, 77, 77, 76, 75, 75, 75, 74, 74, 73, 73, 73, 72, 72, 71, 71, 71, 71, 71, 71, 71, 71, 70, 70, 70, 69, 69, 69, 68, 67, 67, 67, 67, 67, 66, 66, 66, 66, 66, 66, 66, 65, 64, 64, 63, 63, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 63, 63, 63, 63, 63, 63, 64, 64, 64, 65, 65, 65, 65, 65, 65, 66, 66, 66, 66, 66, 67, 67, 67, 67, 67, 67, 68, 68, 68, 69, 69, 69, 69, 69, 69, 70, 70, 70, 70, 71, 71, 72, 72, 73, 74, 74, 75, 76, 76, 77, 77, 77], [69, 69, 69, 69, 69, 69, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 69, 69, 69, 69, 69, 69, 70, 70, 70, 70, 71, 71, 71, 71, 71, 71, 72, 72, 73, 73, 74, 75, 75, 76, 77, 79, 80, 80, 81, 82, 82, 82, 83, 83, 84, 84, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 94, 95, 95, 96, 96, 96, 97, 97, 97, 97, 98, 98, 99, 99, 100, 100, 101, 102, 103, 103, 104, 104, 104, 105, 105, 106, 106, 107, 107, 108, 108, 109, 109, 109, 109, 110, 110, 111, 111, 111, 112, 112, 112, 112, 112, 112, 112, 112, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 114, 114]], [[97, 97, 97, 96, 96, 96, 96, 96, 96, 96, 96, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95], [70, 70, 71, 74, 75, 77, 78, 79, 81, 82, 83, 84, 86, 88, 89, 92, 93, 95, 96, 97, 99, 100, 101, 103, 103, 104, 105, 105, 106, 107, 107, 108, 109, 109, 110, 112, 112, 113, 113]], [[112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 112, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 110, 110, 110, 110, 110, 110, 110], [69, 69, 70, 71, 72, 73, 74, 76, 78, 79, 81, 84, 86, 88, 90, 91, 93, 94, 96, 99, 100, 101, 103, 103, 104, 104, 104, 104, 105, 105, 105, 106, 106, 107, 107, 108]], [[97, 97, 98, 99, 100, 101, 101, 102, 104, 105, 106, 107, 107, 108, 108, 108], [89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 90, 90, 90, 90, 90, 90]], [[131, 131, 132, 133, 133, 133, 134, 134, 135, 136, 137, 137, 137, 138, 139, 139, 140, 140, 141, 141, 141, 142, 142, 142, 143, 143, 143, 144, 144, 144, 144, 144, 144, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 144, 144, 143, 143, 142, 141, 141, 141, 140, 140, 139, 138, 137, 137, 137, 136, 135, 135, 134, 134, 133, 133, 132, 131, 131, 130, 130, 129, 129, 128, 127, 127, 126, 126, 125, 125, 124, 124, 124, 123, 123, 123, 123, 122, 122, 122, 121, 121, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 121, 121, 122, 122, 123, 123, 123, 123, 124, 124, 124, 125, 125, 126, 126, 126, 126, 126, 127, 127, 127, 127, 128, 129, 129, 129, 130], [108, 108, 108, 108, 107, 107, 107, 107, 106, 105, 105, 104, 104, 104, 103, 103, 103, 103, 101, 101, 101, 100, 100, 99, 99, 99, 99, 99, 98, 98, 97, 97, 97, 96, 94, 94, 93, 92, 90, 90, 89, 88, 87, 87, 86, 85, 84, 83, 81, 80, 80, 79, 78, 77, 76, 76, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 76, 77, 77, 77, 77, 78, 78, 78, 78, 78, 79, 79, 80, 81, 81, 82, 83, 84, 85, 86, 86, 87, 88, 89, 90, 92, 93, 93, 93, 94, 95, 96, 97, 97, 98, 99, 100, 100, 101, 101, 101, 102, 102, 102, 103, 103, 103, 103, 103, 103, 104, 104, 104, 104, 104, 104, 104, 104]], [[160, 160, 161, 161, 162, 162, 162, 163, 163, 164, 164, 165, 165, 166, 167, 167, 167, 168, 169, 169, 170, 171, 172, 172, 173, 173, 173, 173, 173, 173, 173, 172, 172, 171, 171, 171, 171, 171, 170, 170, 170, 170, 170, 170, 169, 169, 168, 168, 167, 167, 166, 165, 165, 163, 163, 162, 162, 161, 161, 161, 160, 160, 160, 159, 159, 159, 158, 157, 156, 156, 156, 155, 155, 154, 153, 152, 151, 150, 150, 149, 149, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 149, 150, 150, 150, 151, 151, 152, 152, 152, 153, 154, 154, 154, 155, 156, 156, 156, 157, 157, 157, 157, 158, 159, 159, 159, 159], [106, 106, 106, 106, 106, 106, 105, 105, 105, 105, 105, 104, 104, 104, 104, 103, 103, 102, 101, 101, 99, 99, 97, 96, 95, 94, 94, 93, 93, 92, 92, 90, 90, 89, 87, 86, 84, 83, 82, 82, 82, 82, 82, 81, 81, 80, 79, 79, 77, 76, 75, 75, 74, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 74, 74, 74, 75, 75, 77, 78, 79, 80, 81, 82, 82, 84, 85, 86, 86, 87, 88, 89, 90, 90, 90, 91, 91, 92, 92, 93, 94, 95, 96, 96, 96, 97, 97, 97, 97, 98, 98, 99, 99, 100, 100, 101, 102, 103, 104, 104, 104, 104, 105, 105, 105, 105]], [[187, 187, 187, 187, 187, 187, 188, 188, 189, 189, 189, 189, 189, 189, 189, 189, 189, 189, 189, 189, 189, 188, 188, 188, 188, 188, 188, 188, 188, 188, 187, 187, 188, 189, 189, 190, 190, 191, 192, 193, 194, 196, 199, 200, 202, 204, 206, 207, 208, 209, 209, 210], [73, 73, 74, 76, 78, 80, 82, 85, 86, 88, 89, 91, 93, 97, 98, 99, 100, 100, 100, 101, 101, 101, 101, 101, 102, 102, 103, 103, 103, 104, 104, 104, 104, 104, 104, 104, 104, 104, 104, 103, 103, 103, 103, 103, 104, 104, 104, 104, 105, 105, 105, 105]], [[168, 168, 169, 169, 170, 170, 170, 171, 172, 172, 172, 173, 174, 176, 176, 177, 178, 179, 180, 180, 181, 181, 182, 182, 182, 183, 183, 184, 184, 184, 184, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 184, 184, 183, 183, 182, 182, 181, 180, 179, 178, 178, 178, 177, 176, 176, 175, 175, 175, 174, 174, 174, 173, 173, 172, 172, 171, 170, 170, 169, 168, 167, 167, 166, 165, 165, 165, 164, 164, 164, 163, 163, 163, 162, 162, 162, 162, 162, 161, 161, 161, 161, 161, 161, 162, 162, 163, 163, 163, 163, 163, 163, 163, 164, 164, 165, 165, 166, 167, 167, 168, 169, 169, 170], [178, 178, 178, 178, 178, 178, 177, 177, 177, 177, 177, 176, 176, 175, 175, 174, 173, 172, 171, 170, 170, 169, 169, 169, 168, 168, 167, 167, 167, 167, 167, 166, 166, 165, 164, 163, 163, 162, 161, 161, 161, 160, 160, 159, 159, 159, 159, 159, 158, 158, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 158, 158, 159, 159, 159, 160, 160, 160, 161, 161, 162, 163, 163, 163, 164, 164, 165, 166, 167, 168, 168, 169, 170, 170, 170, 171, 171, 172, 172, 172, 172, 172, 173, 173, 173, 173, 174, 174, 174, 174, 174, 174]], [[60, 60, 61, 61, 61, 62, 62, 63, 63, 64, 64, 65, 65, 66, 66, 67, 69, 70, 70, 70, 70, 71, 71, 71, 72, 73, 73, 74, 74, 75, 75, 76, 76, 76, 77, 77, 77, 77, 77, 77, 77, 77, 76, 76, 76, 75, 75, 75, 74, 73, 72, 71, 71, 70, 69, 67, 66, 65, 64, 62, 62, 61, 61, 60, 60, 60, 59, 58, 58, 58, 56, 56, 56, 55, 55, 54, 54, 54, 54, 54, 54, 54, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 54, 54, 55, 55, 56, 57, 58, 58, 59, 60, 60, 60, 61, 61, 61, 62], [170, 170, 170, 170, 170, 170, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 168, 168, 168, 168, 168, 167, 167, 167, 166, 165, 165, 165, 164, 164, 164, 163, 163, 163, 163, 162, 162, 161, 161, 160, 160, 159, 159, 158, 158, 158, 158, 157, 157, 157, 157, 157, 157, 156, 153, 152, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 152, 152, 152, 153, 153, 154, 154, 155, 156, 156, 157, 158, 159, 159, 160, 160, 161, 161, 162, 163, 163, 163, 163, 164, 164, 164, 165, 165, 165, 166, 166, 167, 167, 167, 167, 167, 167, 167, 167, 167, 167, 167]]]
    img2 = [[[174, 145, 106, 38, 11, 4, 4, 15, 29, 78, 169, 207, 246, 253, 255, 241, 227, 152, 123], [3, 0, 7, 11, 23, 36, 50, 64, 73, 84, 85, 80, 66, 60, 47, 37, 31, 14, 12]], [[1, 0, 110], [38, 100, 100]], [[3, 51, 87, 171, 225, 239], [95, 99, 107, 117, 117, 110]], [[241, 253, 251], [107, 60, 85]], [[217, 151, 100], [113, 111, 106]]]
    img3 = [[[0, 12, 14, 17, 16, 24, 55, 57, 60, 79, 82, 87, 91, 90, 99, 114, 121, 125, 124, 144, 160, 164, 178, 193, 200, 199, 213, 226, 234, 247, 255], [135, 90, 45, 33, 11, 8, 9, 40, 42, 27, 16, 15, 21, 43, 46, 43, 38, 29, 9, 2, 4, 34, 41, 37, 31, 8, 0, 11, 27, 33, 31]]]
    img4 = [[[0, 9, 23, 40, 54, 60, 81, 105, 123, 167, 207, 234, 255], [243, 233, 201, 124, 96, 93, 57, 0, 14, 61, 111, 174, 246]], [[79, 90, 111, 131], [47, 53, 54, 44]]]
    img5 = [[[87, 82, 71, 63, 66, 92, 96, 95], [220, 218, 201, 168, 156, 101, 87, 61]], [[97, 113, 117, 140, 152, 162, 169, 166, 165, 171, 179, 198, 199, 198, 210, 210, 198, 190, 181, 143, 113, 95, 89], [65, 125, 128, 70, 29, 8, 0, 22, 68, 99, 114, 74, 57, 65, 107, 156, 205, 218, 223, 219, 211, 199, 191]], [[105, 100, 96, 95, 95, 101, 127, 132, 144, 148, 156, 164, 173, 164, 148, 133], [195, 189, 174, 140, 144, 154, 171, 166, 128, 149, 156, 155, 140, 191, 208, 209]], [[87, 0], [217, 253]], [[7, 7], [255, 255]]]
    img6 = [[[75, 71, 67, 65, 72, 83], [1, 0, 13, 67, 101, 120]], [[146, 140], [2, 100]], [[204, 193, 191, 184], [2, 95, 100, 89]], [[1, 0, 59, 129, 202, 255], [43, 40, 28, 19, 18, 26]], [[15, 61, 113, 173, 246], [84, 66, 52, 45, 44]]]
    img7 = [[[11, 130, 132, 124, 109, 81, 76, 76, 94, 117, 134, 129, 14, 31, 57, 57, 40, 22, 9, 1, 0, 6, 9, 10, 13], [2, 0, 32, 70, 106, 126, 184, 202, 216, 244, 254, 255, 255, 222, 204, 121, 119, 111, 98, 82, 69, 41, 7, 3, 6]]]
    img8 = [[[168, 98, 58, 41, 26, 1, 0, 4, 11, 42, 47, 49, 72, 155, 212, 246, 255, 247, 191, 189, 209, 205, 200, 179, 175, 170], [52, 57, 71, 83, 80, 84, 100, 110, 114, 118, 111, 99, 102, 101, 90, 77, 64, 57, 50, 24, 14, 3, 0, 2, 12, 46]], [[201, 199, 201], [1, 8, 10]]]
    img9 = [[[115, 106, 95, 88, 86, 91, 102, 115, 145, 164, 178, 184], [80, 79, 86, 97, 110, 131, 148, 160, 176, 176, 163, 137]], [[0, 29], [254, 216]], [[7, 8, 66, 119, 108, 104, 118, 143, 144, 151, 171, 186, 192, 193, 183, 194, 205, 218, 232, 237, 237, 218, 248, 255, 254, 242, 232, 199, 196, 131, 97], [246, 241, 162, 73, 53, 26, 35, 57, 34, 20, 2, 0, 8, 19, 44, 31, 24, 21, 22, 31, 43, 65, 66, 78, 87, 102, 110, 119, 134, 208, 255]], [[152, 179, 185, 182, 185, 188, 177, 132, 110, 92, 90, 90, 96, 102, 90, 86, 110, 124, 151, 180, 188], [179, 174, 160, 145, 149, 162, 172, 168, 154, 129, 120, 101, 87, 81, 99, 119, 151, 161, 170, 170, 162]]]
    img10 = [[[20, 48, 160, 164, 167, 161, 145, 103, 93, 92, 96, 122, 147, 148, 142, 53, 22, 7, 0, 8, 18, 56, 61, 60, 55, 24, 17, 10, 17], [0, 6, 2, 6, 42, 60, 78, 106, 117, 127, 151, 178, 224, 248, 251, 255, 251, 241, 214, 191, 175, 143, 127, 111, 99, 77, 68, 40, 7]]]

    assert test(img1) == "school_bus","errore di classificazione"
    assert test(img2) == "bottlecap","errore di classificazione"
    assert test(img3) == "the_great_wall_of_china","errore di classificazione"
    assert test(img4) == "mountain","errore di classificazione"
    assert test(img5) != "fireplace","errore di classificazione"
    assert test(img6) == "camouflage","errore di classificazione"
    assert test(img7) == "wine_glass","errore di classificazione"
    assert test(img8) == "lobster","errore di classificazione"
    assert test(img9) == "bracelet","errore di classificazione"
    assert test(img10) == "hourglass","errore di classificazione"



    #PLOT...
    plt1 = draw_cv2(img1, size=128, lw=3, augmentation=False)
    plt2 = draw_cv2(img2, size=128, lw=3, augmentation=False)
    plt3 = draw_cv2(img3, size=128, lw=3, augmentation=False)
    plt4 = draw_cv2(img4, size=128, lw=3, augmentation=False)
    plt5 = draw_cv2(img5, size=128, lw=3, augmentation=False)
    plt6 = draw_cv2(img6, size=128, lw=3, augmentation=False)
    plt7 = draw_cv2(img7, size=128, lw=3, augmentation=False)
    plt8 = draw_cv2(img8, size=128, lw=3, augmentation=False)
    plt9 = draw_cv2(img9, size=128, lw=3, augmentation=False)
    plt10 = draw_cv2(img10, size=128, lw=3, augmentation=False)

    plt.subplot(1,5,1)
    plt.imshow(plt1)
    plt.title(test(img1))
    
    plt.subplot(1,5,2)
    plt.imshow(plt2)
    plt.title(test(img2))
    
    plt.subplot(1,5,3)
    plt.imshow(plt3)
    plt.title(test(img3))
    
    plt.subplot(1,5,4)
    plt.imshow(plt4)
    plt.title(test(img4))
 
    plt.subplot(1,5,5)
    plt.imshow(plt5)
    plt.title(test(img5))
    
    plt.show() 

    plt.subplot(1,5,1)
    plt.imshow(plt6)
    plt.title(test(img6))
    
    plt.subplot(1,5,2)
    plt.imshow(plt7)
    plt.title(test(img7))
    
    plt.subplot(1,5,3)
    plt.imshow(plt8)
    plt.title(test(img8))

    plt.subplot(1,5,4)
    plt.imshow(plt9)
    plt.title(test(img9))
    
    plt.subplot(1,5,5)
    plt.imshow(plt10)
    plt.title(test(img10))

    plt.show()   

if __name__ == '__main__':
    main()