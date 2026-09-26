import os
from bs4 import BeautifulSoup
import re
import json
from urllib.parse import quote

def extract_description(html):
    soup = BeautifulSoup(html, "html.parser")
    
    desc_tag = soup.find("meta", attrs={"name": "description"})

    description = None
    if desc_tag and desc_tag.has_attr("content"):
        description = desc_tag["content"].strip()
    
    return description

def extract_title(html):
    soup = BeautifulSoup(html, "html.parser")

    if soup.title and soup.title.string:
        return soup.title.string.strip()
    return None

def extract_keywords(html):
    soup = BeautifulSoup(html, "html.parser")
    title = extract_title(html)
    
    keywords_tag = soup.find("meta", attrs={"name": "keywords"})

    keywords = None
    if keywords_tag and keywords_tag.has_attr("content"):
        keywords = keywords_tag["content"].strip()

    key_list = re.split(r",\s?", keywords)
    title_words = re.findall(r"[a-z0-9]+", title.lower())
    key_list.extend(title_words)
    key_list = sorted(set(key_list))
    
    return ", ".join(key_list)

if __name__ == "__main__":
    index = {}
    folder = os.path.join(os.path.dirname(__file__), "resources")

    for subfolder in sorted(os.listdir(folder)):
        html_path = os.path.join(folder, subfolder, "index.html")
        yml_path = os.path.join(folder, subfolder, "info.yml")
        
        if os.path.exists(html_path):
            with open(html_path, "r") as f:
                html_text = f.read()

            title = extract_title(html_text)
            if not title:
                print("NO TITLE: " + subfolder)

            description = extract_description(html_text)
            if not description:
                print("NO DESCRIPTION: " + subfolder)
            
            keywords = extract_keywords(html_text)
            if not keywords:
                print("NO KEYWORDS: " + subfolder)

            index[subfolder] = {
                "title": title,
                "desc": description,
                "tags": keywords,
                "path": quote(f"{subfolder}/index.html")
            }

        elif os.path.exists(yml_path):
            with open(yml_path, "r") as f:
                yml_text = f.read().strip()
            try:
                title = re.search(r"^title:\s*(.+)$", yml_text, re.MULTILINE).group(1)
                path = f'{subfolder}/{re.search(r"^path:\s*(.+)$", yml_text, re.MULTILINE).group(1)}'
                desc = re.search(r"^desc:\s*(.+)$", yml_text, re.MULTILINE).group(1)
                tags = re.search(r"^tags:\s*(.+)$", yml_text, re.MULTILINE).group(1)

                index[subfolder] = {
                    "title": title,
                    "desc": desc,
                    "tags": tags,
                    "path": path
                }
            except Exception:
                print("ERROR: " + subfolder)
            

    text = "let PublicIndex = " + json.dumps(index, indent=4)
    with open("js/PublicIndex.js", "w") as f:
        f.write(text)
