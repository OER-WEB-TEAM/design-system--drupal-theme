from urllib.request import urlopen
import xml.etree.cElementTree as ET
import json, datetime, tempfile, shutil, urllib.request, hashlib


# Get the JSON releases
api1 = "https://api.github.com/repos/OER-WEB-TEAM/design-system--drupal-theme/releases"
api2 = "https://api.github.com/repos/OER-WEB-TEAM/design-system--drupal-theme/tags"

response = urlopen(api1)
data_json = json.loads(response.read())

# Build XML tree
root = ET.Element("project")
root.set("xmlns:dc","http://purl.org/dc/elements/1.1/")

# Version numbers
vArray = data_json[0]["tag_name"].split(".")
supported = vArray[0] + "." + vArray[1] + "."

ET.SubElement(root, "title").text = "NIHOD5"
ET.SubElement(root, "short_name").text = "NIHOD5"
ET.SubElement(root, "dc:creator").text = "AlexVanK"
ET.SubElement(root, "type").text = "project_theme"
ET.SubElement(root, "supported_branches").text = supported
ET.SubElement(root, "project_status").text = "published"
ET.SubElement(root, "link").text = "https://github.com/OER-WEB-TEAM/design-system--drupal-theme"

# Write terms sub nodes
terms = ET.SubElement(root, "terms")
for x in range(3):
    term = ET.SubElement(terms, "term")
    match x:
        case 0:
            ET.SubElement(term, "name").text = "Projects"
            ET.SubElement(term, "value").text = "Themes"
        case 1:
            ET.SubElement(term, "name").text = "Maintenance status"
            ET.SubElement(term, "value").text = "Actively Maintained"
        case 2:
            ET.SubElement(term, "name").text = "Development status"
            ET.SubElement(term, "value").text = "Under active development"

# Write releases sub nodes
releases = ET.SubElement(root, "releases")

for x in range(len(data_json)):
    release = ET.SubElement(releases, "release")
    fullVersion = data_json[x]["name"]
    
    # Write release meta data
    ET.SubElement(release, "name").text = "NIHOD5 " + fullVersion
    ET.SubElement(release, "version").text = fullVersion
    ET.SubElement(release, "tag").text = fullVersion
    ET.SubElement(release, "status").text = "published"
    ET.SubElement(release, "release_link").text = "https://github.com/OER-WEB-TEAM/design-system--drupal-theme/releases/" + fullVersion
    ET.SubElement(release, "download_link").text = "https://github.com/OER-WEB-TEAM/design-system--drupal-theme/archive/refs/tags/" + fullVersion + ".tar.gz"

    new_time = data_json[x]["published_at"]
    timestamp = datetime.datetime.strptime(new_time, "%Y-%m-%dt%H:%M:%S%z").timestamp()
    ET.SubElement(release, "date").text = str(timestamp).split(".")[0]

    # Write files information
    # This will have to come from the assets array (see api1)
    files = ET.SubElement(release, "files")
    for y in range(len(data_json[x]["assets"])):
        file = ET.SubElement(files,"file")
        fileURL = data_json[x]["assets"][y]["browser_download_url"]
        fileType = "tar.gz" if data_json[x]["assets"][y]["content_type"] else "zip"

        # Fetch file and store temporarily to be able to calculate checksum
        with urllib.request.urlopen(fileURL) as r:
            with tempfile.NamedTemporaryFile(delete=False) as tmpF:
                shutil.copyfileobj(r,tmpF)
        with open(tmpF.name, "rb") as f:
            hash = hashlib.md5()
            while chunk := f.read(8192):
                hash.update(chunk)
    
        ET.SubElement(file, "url").text = fileURL
        ET.SubElement(file, "archive_type").text = fileType
        ET.SubElement(file, "md5").text = hash.hexdigest()
        ET.SubElement(file, "size").text = data_json[x]["assets"][y]["size"]

        # Force filedate to be the same as repo publishing date
        # Technically this is not accurate as the file is generated sligthly later by another worfklow
        ET.SubElement(file, "filedate").text = str(timestamp).split(".")[0]

    terms = ET.SubElement(release, "terms")
    term = ET.SubElement(terms, "term")

    # Write terms information
    release_type = "New features"
    if x > 0:
        currentRelease__versionIndexes = fullVersion.split(".")
        previousRelease_versionIndexes = data_json[x-1]["name"].split(".")
        if currentRelease__versionIndexes[1] > previousRelease_versionIndexes[1]:
            release_type = "New features"
        elif currentRelease__versionIndexes[2] > previousRelease_versionIndexes[2]:
            release_type = "Bug fixes"

    ET.SubElement(term, "name").text = "Release type"
    ET.SubElement(term, "value").text = release_type

    # Write security advisory (perhaps not necessary for custom themes)
    # ET.SubElement(release, "security").text =

tree = ET.ElementTree(root)
tree.write("current", encoding="UTF-8", xml_declaration=True)
