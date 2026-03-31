#include "openharmony/native/sysroot/usr/include/napi/native_api.h"
#include "openharmony/native/sysroot/usr/include/js_native_api_types.h"

#include "third_party/electron_node/src/node.h"

#include "aki/jsbind.h"
#include <string.h>
#include <stdio.h>
#define DECLARE_NAPI_METHOD(name, func) { name, 0, func, 0, 0, 0, napi_default, 0 }

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

static napi_value getNativeContext(napi_env env, napi_callback_info info) {
  napi_value exports;
  if (napi_create_object(env, &exports) != napi_ok) {
    napi_throw_type_error(env, nullptr, "napi_create_object failed");
    return exports;
  }
  
  aki::JSBind::BindSymbols(env, exports);
  return exports;
}

 
static napi_value Initialize(napi_env env, napi_value exports) {
  if (env == nullptr || exports == nullptr) {
    return exports;
  }
  napi_property_descriptor desc[] = {
      DECLARE_NAPI_METHOD("getNativeContext", getNativeContext)
  };
  if (napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]),
                             desc) != napi_ok) {
    return exports;
  }
  
  return exports;
}
 
static napi_module adaptertestModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = Initialize,
    .nm_modname = "adaptertest",
    .nm_priv = ((void*)nullptr),
    .reserved = {nullptr},
};

extern "C" __attribute__((constructor)) void RegisterAdaptertestModule(void) {
  napi_module_register(&adaptertestModule);
}