#include "getpath.h"

#include <functional>
#include "aki/jsbind.h"
namespace PathAdapter {
  std::string GetDir(std::string& getDirFuncName) {
    if (auto getDirFunc = aki::JSBind::GetJSFunction(getDirFuncName)) {
      auto path = getDirFunc->Invoke<std::string>();
      return path;
    }

    return "";
  }
}