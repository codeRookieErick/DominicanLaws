# -*- coding: utf-8 -*-
import re
import os
import uuid
import sqlite3
import winsound


def get_regex(path):
    result = []
    with open(path, 'r', encoding='utf-8') as f:
        result = [i.strip().split('\t') for i in f.readlines()]
    return result


def get_data(path):
    data = ""
    with open(path, 'r', encoding='utf-8') as f:
        data = f.read()
    return data


def execute_query(text, databaseName):
    with sqlite3.connect(databaseName) as connection:
        connection.execute(text)


def save_title(code, name, text):
    query = "INSERT INTO Titulos(codigoTitulo, nombreTitulo, textoTitulo)values('{0}', '{1}', '{2}');"
    execute_query(query.format(code, name, text))


def save_chapter(code, name, text):
    query = "INSERT INTO Capitulos(codigoCapitulo, nombreCapitulo, textoCapitulo)values('{0}', '{1}', '{2}');"
    execute_query(query.format(code, name, text))


def save_section(code, name, text):
    query = "INSERT INTO Secciones(codigoSeccion, nombreSeccion, textoSeccion)values('{0}', '{1}', '{2}');"
    execute_query(query.format(code, name, text))


def save_article(titleCode, chapterCode, sectionCode, articleCode, articleName, articleText):
    columns = 'codigoTitulo, codigoCapitulo, codigoSeccion, codigoArticulo, nombreArticulo, textoArticulo'
    formats = "'{0}', '{1}', '{2}','{3}', '{4}', '{5}'"
    query = "INSERT INTO Articulos({0})values({1});".format(columns, formats)
    execute_query(query.format(titleCode, chapterCode,
                               sectionCode, articleCode, articleName, articleText))


def notify():
    winsound.Beep(2500, 250)


def process(fileName, databaseName):
    notify()
    execute_query("DELETE FROM TITULOS;")
    execute_query("DELETE FROM CAPITULOS;")
    execute_query("DELETE FROM SECCIONES;")
    execute_query("DELETE FROM ARTICULOS;")
    regexList = get_regex('regex')
    result = []
    data = get_data('raw.txt')
    maxLength = len(data)
    for regex in regexList:
        matches = re.finditer(regex[1], data)
        for match in matches:
            result.append((regex[0], match))
    result.sort(key=lambda x: x[1].start())
    result = [{"level": i[0], "value": i[1].group(
        0), "startOfValue":i[1].start(), "data": None, "startOfData": i[1].end(), "endOfData": None} for i in result]

    titulo = {}
    capitulo = {}
    seccion = {}
    articulo = {}
    for i in range(0, len(result)):
        if i == len(result) - 1:
            result[i]['endOfData'] = maxLength
        else:
            result[i]['endOfData'] = result[i + 1]['startOfValue']
        result[i]['data'] = data[result[i]
                                 ['startOfData']:result[i]['endOfData']]
        result[i]['code'] = str(uuid.uuid4())
        result[i]['data'] = re.sub(r'\s', ' ', result[i]['data']).strip()
        level = result[i]['level']
        if level == "TITULO":
            titulo = result[i]
            capitulo = seccion = articulo = None
            save_title(result[i]['code'], result[i]
                       ['value'], result[i]['data'])
        elif level == "CAPITULO":
            capitulo = result[i]
            seccion = articulo = None
            save_chapter(result[i]['code'], result[i]
                         ['value'], result[i]['data'])
        elif level == "SECCION":
            seccion = result[i]
            articulo = None
            save_section(result[i]['code'], result[i]
                         ['value'], result[i]['data'])
        elif level == "ARTICULO":
            articulo = result[i]
            codigoTitulo = titulo['code'] if titulo != None else ''
            codigoCapitulo = capitulo['code'] if capitulo != None else ''
            codigoSeccion = seccion['code'] if seccion != None else ''
            save_article(codigoTitulo, codigoCapitulo, codigoSeccion,
                         articulo['code'], articulo['value'], articulo['data'])
        print(result[i]['value'])
    notify()


process()
