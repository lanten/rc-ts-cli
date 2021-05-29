import chalk from 'chalk'

const config = {
  INFO: { bgColor: 'bgCyan', textColor: 'white' },
  WARN: { bgColor: 'bgYellow', textColor: 'yellow' },
  SUCCESS: { bgColor: 'bgGreen', textColor: 'green' },
  ERROR: { bgColor: 'bgRed', textColor: 'red' },
}

export type LogTypes = keyof typeof config

/**
 * 控制台输出扩展
 */
export class ExConsole {
  info(message: string) {
    this.log('INFO', chalk[config.INFO.textColor](message))
  }

  warn(message: string) {
    this.log('WARN', chalk[config.WARN.textColor](message))
  }

  /**
   * 输出错误日志
   * @param message
   * @param showDetail 显示错误详情
   * @param exit 是否终止进程
   */
  error(message: string | Error, showDetail = false, exit?: boolean) {
    let messageH: string
    if (message instanceof Error) {
      messageH = `${chalk.bold(message.name)}: ${message.message}`
      if (showDetail) messageH = `Detail: ${messageH}\n${message.stack}`
    } else {
      messageH = message
    }
    this.log('ERROR', chalk.red(messageH))

    if (exit) {
      process.exit()
    }
  }

  success(message: string) {
    this.log('SUCCESS', chalk[config.SUCCESS.textColor](message))
  }

  log(type: LogTypes, message: string | Error) {
    const conf = config[type]
    const str = `[${this.getTimeStr()}] ${chalk.white[conf.bgColor].bold(this.center(type))} ${message}`

    console.log(str)
    return str
  }

  loading(message?: string) {
    const startTime = this.getTimeStr()
    // const P = ['\\', '|', '/', '-']
    // const P = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
    // const P = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛']
    const P = ['▘', '▝', '▗', '▖']
    // const P = ['◶', '◵', '◴', '◷']

    let x = 0
    const twirlTimer = setInterval(() => {
      const stateStr = P[x++]
      process.stdout.write(`\r[${startTime}] ${this.center(stateStr)} ${message}`)
      x &= 3
    }, 80)

    return (type: keyof typeof config, stopMessage?: string) => {
      const conf = config[type]
      const infoStr = `[${this.getTimeStr()}] ${chalk.white[conf.bgColor].bold(this.center(type))}`

      if (message) process.stdout.write('\r'.padEnd(infoStr.length + message.length, ' ')) // 清除历史信息
      process.stdout.write(`\r${infoStr} ${chalk[config[type].textColor](stopMessage)}`)
      process.stdout.write('\n')

      clearInterval(twirlTimer)
    }
  }

  /**
   * 文本居中
   * @param str
   * @param width 总长度
   * @returns
   */
  center(str: string, width = 9) {
    const lack = width - str.length

    if (lack <= 0) return str

    const offsetLeft = parseInt(String(lack / 2))
    const offsetRight = lack - offsetLeft

    return `${this.getSpaceStr(offsetLeft)}${str}${this.getSpaceStr(offsetRight)}`
  }

  getSpaceStr(count: number) {
    let str = ''
    for (let i = 0; i < count; i++) {
      str += ' '
    }
    return str
  }

  /**
   * 获取当前时间
   * @returns
   */
  getTimeStr() {
    const date = new Date()

    const obj = {
      H: date.getHours().toString().padStart(2, '0'),
      I: date.getMinutes().toString().padStart(2, '0'),
      S: date.getSeconds().toString().padStart(2, '0'),
      MS: date.getMilliseconds().toString().padStart(3, '0'),
    }

    return `${chalk.hex('#f78c6c')(`${obj.H}:${obj.I}:${obj.S}`)}.${chalk.hex('#b2ccd6')(obj.MS)}`
  }
}

export const exConsole = new ExConsole()
