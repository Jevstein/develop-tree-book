#**********************************************************
#
# by jevstein
# 2020/01/03
#
# Note: 
#
#**********************************************************

### 1.CONFIG
DEBUG		 = YES
APP_NAME     = example
APP_OUT      = $(APP_NAME)
APP_OUTS     = $(APP_NAME)
ROOT_DIR	 = ../../..
OUT_DIR      = $(ROOT_DIR)/bin
OBJ_DIR		 = $(ROOT_DIR)/bin/obj/linux/minicrt/example
INCS_DIR	 = $(ROOT_DIR)/include
LIBS_DIR	 = $(ROOT_DIR)/lib
LIBS		 = $(LIBS_DIR)/libminicrt.a
VPATH		 = $(ROOT_DIR)/src
SRCS		 = $(wildcard $(ROOT_DIR)/src/example.c)

EXTRA_OBJS   = $(ROOT_DIR)/bin/obj/linux/minicrt/lib/entry.o

### 2.TOOL CHAIN
MKDIR        := mkdir -p
CP           := cp
CC           := gcc -c
AR           := ar
LD  		 := ld
RM			 := rm
INSTALL		 := $(CP)
DBG_DATE     := $(shell date +"%F %T")
DBG_ECHO     := @echo [$(DBG_DATE)]
DBG_FLAG     := 

ifeq ($(DEBUG), YES)
    DEBUG_FLAGS := -g
else
    DEBUG_FLAGS := -O3
endif

ARFLAGS		 := -rs
CFLAGS		 := $(DEBUG_FLAGS) -ggdb -fno-builtin -nostdlib -fno-stack-protector -DMINI_CRT
CFLAGS		 += $(EXTRA_CFLAGS) -I$(INCS_DIR)
# LDFALGS		 := -static -e mini_crt_entry
LDFALGS		 := -static -e _mini_crt_entry

### 3.RECOMBINE FILES
SRCS 	     := $(notdir $(SRCS))
OBJS	     := $(addsuffix .o, $(basename $(SRCS)))
OBJS	     := $(patsubst %.o, $(OBJ_DIR)/%.o, $(OBJS))

OBJ_APP_OUTS := $(addprefix $(OBJ_DIR)/, $(APP_OUTS))
OUT_APP_OUTS := $(addprefix $(OUT_DIR)/, $(APP_OUTS))

APP_OUT      := $(OBJ_DIR)/$(APP_OUT)
LIB_OUT      := $(filter %.a, $(OBJ_APP_OUTS))
DLIB_OUT     := $(filter %.so, $(OBJ_APP_OUTS))

### 4.OUTPUT
all: rely prog install
	$(info [$(DBG_DATE)] make$(DBG_FLAG): $(APP_OUTS) -> all success!)

rely:
	$(MAKE) -f lib.mk

clean_rely:
	$(MAKE) -f lib.mk cleanall

prog: $(OBJ_APP_OUTS)
	$(info [$(DBG_DATE)] make$(DBG_FLAG): $^)

install: $(OUT_APP_OUTS)
	$(info [$(DBG_DATE)] make$(DBG_FLAG): $^)

clean:
	$(RM) -rf $(OBJ_DIR)

cleaninstall:
	$(RM) -rf $(OUT_DIR)

cleanall: clean_rely clean cleaninstall
	$(info [$(DBG_DATE)] clean -> all success!)

### 5.COMMON RULE
$(OUT_APP_OUTS): $(OBJ_APP_OUTS)
	$(info [$(DBG_DATE)] installing $@ ...)
	@$(MKDIR) $(OUT_DIR) ..
	@$(CP) $< $@

$(APP_OUT): $(OBJS) 
	$(info [$(DBG_DATE)] linking $@ ...)
	$(LD) $(LDFALGS) $(EXTRA_OBJS) $^ $(LIBS) -o $@

# $(LIB_OUT): $(OBJS)
# 	$(info [$(DBG_DATE)] linking $@ ...)
# 	$(AR) $(ARFLAGS) $@ $^ $(LIBS)

# $(DLIB_OUT): $(OBJS)
# 	$(info [$(DBG_DATE)] linking $@ ...)
# 	$(CXX) -shared $(LDFALGS) -o $@ $^ $(LIBS)

# $(OBJ_DIR)/%.o : %.cpp
# 	$(info [$(DBG_DATE)] compling $@ ...)
# 	@$(MKDIR) $(OBJ_DIR) ..
# 	$(CC) -c -fPIC $(CFLAGS) $^ -o $@

$(OBJ_DIR)/%.o : %.c
	$(info [$(DBG_DATE)] compling $@ ...)
	@$(MKDIR) $(OBJ_DIR) ..
	$(CC) $(CFLAGS) $^ -o $@