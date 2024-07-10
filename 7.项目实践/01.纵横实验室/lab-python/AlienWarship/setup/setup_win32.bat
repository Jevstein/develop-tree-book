::用pyinstaller将py打包成exe

@echo off

set /p var=Please input command: 
::echo %var%


::if "%var%" == "1" ( call:func1 ) else ( if "%var%" == "2" ( call:func2 ) else (call:func3))

if "%var%" == "1"  goto func_build
if "%var%" == "2"  (goto func_install) else (goto func_fail)


:: 函数
:func_build
	echo 1.build ...
	
	echo 1).delete: build/*, dist/*, pyinstaller-script.spec
	rmdir /q /s build
	rmdir /q /s dist
	::del pyinstaller-script.spec
	
	echo 2).generate AlienWarship ...
	::C:\Python27\Scripts\pyinstaller.exe -w -F C:\Python27\Scripts\pyinstaller-script.py ..\main.py
	python C:\Python27\Scripts\pyinstaller-script.py -w -F ..\main.py
goto end

:: 函数
:func_install
	echo 2.install ...
	
	::如原来.spec文件为:
	:: "a = Analysis(['..\\main.py'],
	  ::      pathex=['D:\\YiStudio\\YiTechStudio001\\src\\lab\\python\\example\\AlienWarship\\setup'],
	  ::      binaries=[],
	  ::      datas=[('../images','images/')],
	::      ..."
	::
	::添加附件，修改：
	::datas=[('../images','images/')],
	::
	
	python C:\Python27\Scripts\pyinstaller-script.py -w main.spec
	xcopy "../images/*" "dist/images/" 

goto end

:: 函数
:func_fail
	echo error: failed to input command!
goto end
	
:: goto:eof

:: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: :: 

::if 0
::(
::	echo 1.delete build/*, dist/*, pyinstaller-script.spec
::	rmdir /q /s build
::	rmdir /q /s dist
::	::del pyinstaller-script.spec
::	
::	echo 2.generate AlienWarship ...
::
::	::C:\Python27\Scripts\pyinstaller.exe -w -F C:\Python27\Scripts\pyinstaller-script.py ..\main.py
::	python C:\Python27\Scripts\pyinstaller-script.py -w -F ..\main.py
::)
::else 
::(
::	echo 3.check whether modify '.spec'
::	::如原来.spec文件为:
::	:: "a = Analysis(['..\\main.py'],
::    ::      pathex=['D:\\YiStudio\\YiTechStudio001\\src\\lab\\python\\example\\AlienWarship\\setup'],
::    ::      binaries=[],
::    ::      datas=[('../images','images/')],
::	::      ..."
::	::
::	::添加附件，修改：
::	::datas=[('../images','images/')],
::	::
::	
::	echo 4. reinstall ...
::	python C:\Python27\Scripts\pyinstaller-script.py -w main.spec
::	xcopy "../images/*" "dist/images/" 
::)

::	@pause
::goto:eof

@echo on

:end
	echo successfully!