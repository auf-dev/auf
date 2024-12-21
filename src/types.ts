import { Version } from "./config"

export interface HTTPInstall {
  installType: 'http'
  url: string
}

export interface HTTPSInstall {
  installType: 'https'
  url: string
}

export interface ScriptInstall {
  installType: 'script'
  script: string
}

export interface GitInstall {
  installType: 'git'
  url: string
  branch: string
}

export interface NpmInstall {
  installType: 'npm'
  package: string
}

export type Install = HTTPInstall | HTTPSInstall | ScriptInstall | GitInstall | NpmInstall

export type Package = {
  name: string
  description: string
  dependencies: Record<string, Version>
  platform?: 'windows' | 'macos' | 'linux'
  architecture?: 'x86' | 'arm' | 'mips' | 'risc-v'
  // TODO: reboot
} & Install
