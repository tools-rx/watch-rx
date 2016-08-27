import path from 'path'

export class GlobResultFile {

  get fullname () {
    if (this.hasName) {
      return path.join(this.basedir || '', this.name)
    }
  }

  get basename () {
    if (this.hasName) {
      return path.basename(this.name)
    }
  }

  get dirname () {
    if (this.hasName) {
      return path.dirname(this.fullname)
    }
  }

  get extname () {
    if (this.hasName) {
      return path.extname(this.name)
    }
  }

  get hasName () {
    return (!!this.basedir && !!this.name) || !!this.name
  }
}
