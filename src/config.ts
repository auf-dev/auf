import { homedir } from 'node:os'
import { resolve } from 'node:path'
import fs from 'node:fs'

type VersionNumber = `${number}` | '*'

type VersionPrefix = '^' | '~' | '*' | ''

type Latest = 'latest'

export type Version = `${VersionPrefix}${VersionNumber}.${VersionNumber}.${VersionNumber}` | Latest

export interface AufConfig {
  proxy: string
}

export interface AufProfile {
  // Force the platform, if not set, it will be set to the current platform
  platform?: 'win' | 'mac' | 'linux'
  // Force the architecture, if not set, it will be set to the current architecture
  arch?: 'x86' | 'arm' | 'mips' | 'risc-v'
  // The dependencies of the profile
  dependencies: {
    [key: string]: string
  }
}

export function defineConfig(config: AufConfig): AufConfig {
  return config
}

export function defineProfile(profile: AufProfile): AufProfile {
  return profile
}

export function createProcessor() {
  const home = homedir()
  const rcDir = resolve(home, '.aufrc')

  // Check if the rcDir exists
  if (!fs.existsSync(rcDir)) {
    fs.mkdirSync(rcDir, { recursive: true })
  }

  // Check if the rcFile exists
  const configFile = resolve(rcDir, 'config.json')
  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify(defineConfig({
      proxy: 'https://repository.auf-cli.dev'
    }), null, 2))
  }

  // Check if the profileFile exists
  const profileFile = resolve(rcDir, 'profile.json')
  if (!fs.existsSync(profileFile)) {
    fs.writeFileSync(profileFile, JSON.stringify(defineProfile({
      dependencies: {}
    }), null, 2))
  }

  function getProxy() {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    return config.proxy
  }

  function setProxy(proxy: string) {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    config.proxy = proxy
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2))
  }

  function getProfile(): AufProfile {
    const profile = JSON.parse(fs.readFileSync(profileFile, 'utf8'))
    return profile
  }

  function setProfile(profile: AufProfile) {
    fs.writeFileSync(profileFile, JSON.stringify(profile, null, 2))
  }

  return {
    getProxy,
    setProxy,
    getProfile,
    setProfile,
  }
}

export type Processor = ReturnType<typeof createProcessor>
