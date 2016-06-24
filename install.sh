#!/bin/bash

# This script prompt you where you want to install this zimlet

zimlet_name="fr_beezim_jitsi"
zimlet_directory="/opt/zimbra/zimlets-deployed/_dev"
temp_folder="/tmp"

echo "We are about to install the Zimlet, do you want to deploy it as a developer ? (y/N)"
read answer
if [[ $answer =~ ^(yes|y) ]]
        then
        if [ -d "$zimlet_directory/$zimlet_name" ]; then
                echo "Zimlet already installed. Deleting old version..."
                rm -Rf $zimlet_directory/$zimlet_name/
                echo "Copying the zimlet"
                cp -rv $zimlet_name/ $zimlet_directory/ > /dev/null 2>&1
                su zimbra -c "/opt/zimbra/bin/zmprov fc all"
                echo "Installation in the developer folder sucessfull"
        elif [ -d "$zimlet_directory" ]; then
                echo "Copying the zimlet"
                cp -rv $zimlet_name/ $zimlet_directory/ > /dev/null 2>&1
                su zimbra -c "/opt/zimbra/bin/zmprov fc all"
                echo "Installation in the developer folder sucessfull"
        elif [ ! -d "$zimlet_directory" ]; then
                echo "The _dev directory seems to be absent. Creating..."
                mkdir $zimlet_directory
                echo "Copying the zimlet"
                cp -rv $zimlet_name/ $zimlet_directory/ > /dev/null 2>&1
                su zimbra -c "/opt/zimbra/bin/zmprov fc all"
                echo "Installation in the developer folder sucessfull"
        fi
else
        if ! [ -x "$(command -v zip)" ]; then
                echo 'zip command needs to be installed.' >&2
        else
        zip -q --junk-paths -r $temp_folder/$zimlet_name.zip $zimlet_name/
        su - zimbra -c "zmzimletctl deploy $temp_folder/$zimlet_name.zip > /dev/null 2>&1"
        su zimbra -c "/opt/zimbra/bin/zmprov fc all > /dev/null 2>&1"
        rm $temp_folder/$zimlet_name.zip
        echo "Installation sucessfull"
        fi
fi
