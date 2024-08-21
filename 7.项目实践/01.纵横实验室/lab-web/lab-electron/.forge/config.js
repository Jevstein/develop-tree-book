module.exports = {
  packagerConfig: {
    // 配置打包选项，例如应用程序名称、版本等

    osxSign: {},
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-deb', // 为Linux生成.deb包
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm', // 为Linux生成.rpm包
      config: {}
    },
    {
      name: '@electron-forge/maker-dmg', // 为macOS生成.dmg包
      config: {}
    },
    {
      name: '@electron-forge/maker-zip', // 为所有平台生成.zip包
      config: {}
    },
    {
      name: '@electron-forge/maker-exe', // 为Windows生成.exe安装程序
      config: {}
    }
  ]
};