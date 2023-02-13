import { Exclude, Expose } from 'class-transformer';

export class rateVersionDTO {
  @Exclude() private _version: Array<{ version: string }>;

  @Expose()
  get version() {
    return this._version;
  }
  set version(version: Array<{ version: string }>) {
    this._version = version;
  }
  static tranformDto(version: { version: string }[]) {
    const versionInfo = new rateVersionDTO();
    versionInfo.version = version;
    return versionInfo;
  }
}
