import { AufConfig, Processor, Version } from "./config"
import { Package } from "./types"

export function parsePackage(packageJson: string): Package {
  const packageData = JSON.parse(packageJson) as Package
  return packageData
}

export function createInstaller(processor: Processor) {
  const proxy = processor.getProxy()
  const profile = processor.getProfile()

  async function fetchPackage(packageName: string): Promise<Package> {
    const response = await fetch(`${proxy}/packages/${packageName}`)
    const packageData = await response.json()
    return packageData
  }

  async function addPackage(packageName: string, version?: Version) {
    const packageData = await fetchPackage(packageName)
    const { name } = packageData
    profile.dependencies[name] = version ?? 'latest'
    save()
  }

  function getPackageVersion(packageName: string) {
    return profile.dependencies[packageName]
  }

  function checkPackage(packageName: string) {
    return profile.dependencies[packageName] ? true : false
  }

  async function installPackage(packageName: string) {
    if (checkPackage(packageName)) await addPackage(packageName)
    const packageData = await fetchPackage(packageName)
    const { name, description, dependencies, installType } = packageData
    const version = getPackageVersion(packageName)
    switch (installType) {
      case 'http':
        break
      case 'https':
        break
      case 'script':
        break
      case 'git':
        break
      case 'npm':
        break
    }
  }

  function save() {
    processor.setProfile(profile)
  }
}
