from urllib.request import urlopen
import json
import xml.etree.cElementTree as ET
import datetime

# Get the JSON releases
response = urlopen("https://api.github.com/repos/OER-WEB-TEAM/design-system--drupal-theme/releases")
data_json = json.loads(response.read())

# Build XML tree
root = ET.Element("project")
root.set("xmlns:dc","http://purl.org/dc/elements/1.1/")

# version numbers
vArray = data_json[0]["tag_name"].split(".")

ET.SubElement(root, "title").text = "NIHOD5"
ET.SubElement(root, "short_name").text = "NIHOD5"
ET.SubElement(root, "dc:creator").text = "AlexVanK"
ET.SubElement(root, "type").text = "project_theme"
ET.SubElement(root, "supported_branches").text = vArray[0] + "." + vArray[1] + "."
ET.SubElement(root, "project_status").text = "published"
ET.SubElement(root, "link").text = "https://github.com/OER-WEB-TEAM/design-system--drupal-theme"

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

releases = ET.SubElement(root, "releases")

for x in range(len(data_json)):
    release = ET.SubElement(releases, "release")

    # Write release meta data
    ET.SubElement(release, "name").text = "NIHOD5 " + data_json[x]["name"]
    ET.SubElement(release, "version").text = data_json[x]["tag_name"]
    ET.SubElement(release, "tag").text = data_json[x]["tag_name"]
    ET.SubElement(release, "status").text = "published"
    ET.SubElement(release, "release_link").text = data_json[x]["html_url"]
    ET.SubElement(release, "download_link").text = data_json[x]["tarball_url"]

    new_time = data_json[2]["published_at"]
    timestamp = datetime.datetime.strptime(new_time, "%Y-%m-%dt%H:%M:%S%z").timestamp()
    ET.SubElement(release, "date").text = str(timestamp).split(".")[0]

    # Write files information
    files = ET.SubElement(release, "files")
    for y in range(2):
        file = ET.SubElement(files,"file")
        match y:
            case 0:
                ET.SubElement(file, "url").text = data_json[x]["tarball_url"]
                ET.SubElement(file, "archive_type").text = "tar.gz"
            case 1:
                ET.SubElement(file, "url").text = data_json[x]["zipball_url"]
                ET.SubElement(file, "archive_type").text = "zip"

    terms = ET.SubElement(release, "terms")
    term = ET.SubElement(terms, "term")

    # Write terms information
    release_type = "New features"
    if x > 0:
        currentRelease__versionIndexes = data_json[x]["tag_name"].split(".")
        previousRelease_versionIndexes = data_json[x-1]["tag_name"].split(".")
        if currentRelease__versionIndexes[1] > previousRelease_versionIndexes[1]:
            release_type = "New features"
        elif currentRelease__versionIndexes[2] > previousRelease_versionIndexes[2]:
            release_type = "Bug fixes"

    ET.SubElement(term, "name").text = "Release Type"
    ET.SubElement(term, "value").text = release_type

    # Write security advisory (perhaps not necessary for custom themes)
    # ET.SubElement(release, "security").text =

tree = ET.ElementTree(root)
tree.write("current", encoding="UTF-8", xml_declaration=True)
