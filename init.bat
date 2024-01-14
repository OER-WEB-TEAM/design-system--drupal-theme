:: Suppress any warnings
cls

:: Do not print commands, this would be confusing
@ECHO OFF

:: Check path location of .bat caller
:: If remote - mount location to a temporary driver letter
IF "%CD%"=="C:\Windows" (pushd %~dp0)

:: Check if subtheme exists in parent folder, if not
:: 1 - Download subtheme from major version related branch
:: 2 - Unzip
:: 3 - Rename unzipped folder to nihod5__subtheme
:: 4 - Move it to the parent directory
:: 5 - cleanup download file of step 1
IF EXIST ..\nihod5__subtheme (
	ECHO You have already setup your NIHOD5 Subtheme. You're good to go!
) ELSE (
	curl https://codeload.github.com/OER-WEB-TEAM/design-system--drupal-theme/zip/refs/heads/5.x.x--subtheme -L -o nihod5__subtheme.zip
	tar -xf nihod5__subtheme.zip
	ren design-system--drupal-theme-5.x.x-subtheme nihod5__subtheme
	move nihod5__subtheme ..
	del nihod5__subtheme.zip
)

:: Check path location of .bat caller
:: If remote - unmount previousy mounted drive letter
IF "%CD%"=="C:\Windows" (popd)

pause