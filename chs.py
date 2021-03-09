#! /usr/bin/python3
# -*- coding: utf-8 -*-
WhiteFileType = (".ts", ".js", ".json", ".prefab")
excludeFile = ("cc_language.js") #需要过滤的文件
checkPattern = r"[\s\S]*[\u4e00-\u9fa5]+[\s\S]*"
chsPattern = r"\"([^\\\"]*?(?:\\.)*[^\\\"]*?[\u4e00-\u9fa5]+[^\\\"]*?(?:\\.)*[^\\\"]*?)\"|\'([^\\\']*?(?:\\.)*[^\\\']*?[\u4e00-\u9fa5]+[^\\\']*?(?:\\.)*[^\\\']*?)\'|`([^\\`]*?(?:\\.)*[^\\`]*?[\u4e00-\u9fa5]+[^\\`]*?(?:\\.)*[^\\`]*?)`|\"([\s\S]*?)\"|\'([\s\S]*?)\'|`([\s\S]*?)`|(//.*?[\n]+)|(/\*[\s\S]*?\*/)"
outputFileList = []
translateDict = {}
visitWord = {}
oldFileList = {}
import os
import sys
import re
import getopt

def replaceFunc(source):
    string = source.group()
    if string[0] == "\"" or string[0] == "'" or string[0] == "`":
        if re.match(checkPattern, string):
            key = string[1:-1]
            if key in translateDict:
                return string.replace(key, translateDict[key], 1)
            else:
                print(key + " is not in translate file!")
    return string

def replaceChs(filePath):
    inputFile = open(filePath, "r", encoding='UTF-8')
    content = inputFile.read()
    realContent = re.sub(chsPattern, replaceFunc, content)
    inputFile.close()

    inputFile = open(filePath, "w", encoding='UTF-8')
    inputFile.write(realContent)
    inputFile.close()

def generateTransale(sfile, tfile):
    sFile = open(sfile, "r", encoding='UTF-8')
    tFile = open(tfile, "r", encoding='UTF-8')
    sourceFile = []
    targetFile = []
    for line in sFile:
        sourceFile.append(re.sub(r"$\n", "", line))
    for line in tFile:
        targetFile.append(re.sub(r"$\n", "", line))
    for i in range(0, len(sourceFile)):
        translateDict[sourceFile[i]] = targetFile[i]
    sFile.close()
    tFile.close()

def getChs(filePath):
    try:
        inputFile = open(filePath, "r", encoding='UTF-8')
        content = inputFile.read()
        resList = re.findall(chsPattern, content)
        for strList in resList:
            if strList not in visitWord:
                visitWord[strList] = 1
                outputFileList.append(strList)
        inputFile.close()
    except BaseException as e:
        print('出错',filePath,e)
    finally:
        inputFile.close()

def generateFile(dirPath):
    if os.path.isdir(dirPath):
        if not dirPath.endswith("/"):
            outputFile = open(dirPath+"/output.txt", "w", encoding='UTF-8')
        else:
            outputFile = open(dirPath+"output.txt", "w", encoding='UTF-8')
    for contentLine in outputFileList:
        for i in range(0, 3):
            if len(contentLine[i]) > 0:
                if contentLine[i] not in oldFileList:
                    outputFile.write(contentLine[i] + "\n")
                else:
                    print(contentLine[i])
    outputFile.close()

def traverseFiles(dirPath, typeOp):
    dirNameList = os.listdir(dirPath)
    for dirName in dirNameList:
        if dirName.startswith('.'):
            continue
        joinDirPath = os.path.join(dirPath, dirName)
        print(joinDirPath)
        if os.path.isfile(joinDirPath):
            if os.path.splitext(joinDirPath)[-1] in WhiteFileType and os.path.split(joinDirPath)[-1] not in excludeFile:
                if typeOp == 0:
                    getChs(joinDirPath)
                elif typeOp == 1:
                    replaceChs(joinDirPath)
                pass
        else:
            traverseFiles(joinDirPath,typeOp)

def getOldChs():
    try:
        f = open("oldoutput.txt", "r", encoding='UTF-8')
        line = f.readline()
        line = line[:-1]
        while line:
            oldFileList[line] = 1
            line = f.readline()
            line = line[:-1]
        f.close()
    except:
        print("找不到旧文件，直接抽取")

def main(argv):
    inputfile = ''
    outputfile = ''
    sourcefile = ''
    targetfile = ''
    try:
        opts, args = getopt.getopt(argv,"hi:o:s:t:",["ifile=","ofile=", "sfile=","tfile="])
    except getopt.GetoptError:
        print('使用xxxx.py -h进行脑补')
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print("要求文件或文件目录，请输入绝对路径")
            print('提取中文：test.py -i <inputfile/dir> -o <outputfile/dir>')
            print('翻译中文：test.py -i <inputfile/dir> -s <chsfile> -t <transalefile>')
            print('-i：需要处理的文件或文件目录')
            print('-o：提取需要处理文件的翻译到文件或文件目录')
            print('-s：原提取的翻译文件')
            print('-t：翻译之后的翻译文件')
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfile = arg
        elif opt in ("-o", "--ofile"):
            outputfile = arg
        elif opt in ("-s", "--sfile"):
            sourcefile = arg
        elif opt in ("-t", "--tfile"):
            targetfile = arg

    if len(inputfile) == 0:
        print('使用xxxx.py -h进行脑补')
        sys.exit(2)
    elif len(outputfile) > 0:
        getOldChs()
        traverseFiles(inputfile, 0)
        generateFile(outputfile)
    elif len(sourcefile) > 0 and len(targetfile) > 0:
        generateTransale(sourcefile, targetfile)
        traverseFiles(inputfile, 1)
    else:
        print('使用xxxx.py -h进行脑补')
        sys.exit(2)

if __name__=="__main__":
    main(sys.argv[1:])
