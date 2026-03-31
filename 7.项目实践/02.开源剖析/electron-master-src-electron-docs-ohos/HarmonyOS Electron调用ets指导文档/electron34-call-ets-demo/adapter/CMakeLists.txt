# Project Name 
SET(TARGETFILENAME "adaptertest")
PROJECT(${TARGETFILENAME}) 
 
#  CMake minimum version requirement setting
cmake_minimum_required(VERSION 3.8)

# set electron path
set(ELE_PATH ~/electron_dev/chromium-electron)

# ohos
set(CMAKE_C_COMPILER ${ELE_PATH}/src/ohos_sdk/openharmony/native/llvm/bin/clang)
set(CMAKE_CXX_COMPILER ${ELE_PATH}/src/ohos_sdk/openharmony/native/llvm/bin/clang++)
set(CMAKE_CXX_FLAGS "--target=aarch64-linux-ohos")

# 设置包含目录
# ohos
include_directories(${ELE_PATH}/src/)
include_directories(${ELE_PATH}/src/third_party/electron_node/deps/v8/include/)
include_directories(${ELE_PATH}/src/ohos_sdk/)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../aki/include)

message(${CMAKE_CURRENT_SOURCE_DIR})
 
set(src demo.cc getpath.cc)
set(headers getpath.h)

# 生成可执行文件
#add_executable(${TARGETFILENAME} demo.cpp)
 
 
# 生成静态库
#ADD_LIBRARY(${TARGETFILENAME} STATIC demo.cpp) 
 
 
# 生成动态库或共享库
ADD_LIBRARY (${TARGETFILENAME} SHARED 
     ${src}
)
target_compile_features(${TARGETFILENAME} PUBLIC cxx_std_17)
target_compile_definitions(${TARGETFILENAME} PUBLIC JSBIND_USING_NAPI=1)
target_compile_definitions(${TARGETFILENAME} PUBLIC AKI_BUILDING_SHARED=1)

# 设置链接库文件-ohos
target_link_libraries(${TARGETFILENAME} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/../aki/build/src/libaki_jsbind.so)
target_link_libraries(${TARGETFILENAME} PUBLIC ${ELE_PATH}/src/out/musl_64/libelectron.so)

# 修改后缀名为  .node    
# SET_TARGET_PROPERTIES(${TARGETFILENAME} PROPERTIES SUFFIX ".node")
