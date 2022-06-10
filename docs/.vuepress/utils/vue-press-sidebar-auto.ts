import fs from 'fs'
import path from 'path'


const readFiles = (absolutePath: string, excludes?: string[]) => {
    const files = fs.readdirSync(absolutePath)
    
    const arr = files.sort(function(a, b) {
        // README.md在最前面
        if (a === 'README.md') return -1
        if (b === 'README.md') return 1
        // 截取'-'之前的数字进行排序 例如 1-vue 2-vue 3-vue
        return Number(a.split('-')[0]) - Number(b.split('-')[0])
    })

    return arr
}

export function getNavbar(text: string, relativePath: string, excludes?: string[]) {
    const children: any[] = []
    const absolutePath = path.join(__dirname, '../../' + relativePath)

    const arr = readFiles(absolutePath, excludes)

    // 排除检查的文件
    const excludesList = ['assets']
    if (excludes) {
        excludesList.push(...excludes)
    }

    // 默认主题的导航栏Group最大深度为2
    arr.forEach(function(item) {
        if (!excludesList.includes(item)) {
            const itemPath = path.join(absolutePath, '/', item)
            const stat = fs.lstatSync(itemPath)
            if(stat.isDirectory()) {
                children.push({
                    text: item,
                    children: fs.readdirSync(itemPath).filter((value) => {
                        return !fs.lstatSync(path.join(itemPath, '/', value)).isDirectory()
                    }).map((value) => {
                        return `${relativePath}/${item}/${value}`
                    })
                })
            } else {
                children.push(relativePath + '/' + item)
            }
        }
    })

    // 当一个目录下既有文件又有目录时，文件在前
    children.sort((a, b) => {
        if(typeof a === 'string' && typeof b !== 'string') {
            return -1
        } else if(typeof b === 'string' && typeof a !== 'string') {
            return 1
        }
        return 0
    })
    const frame = {
        text,
        children,
    }
    return frame
}

export function genSideBar(text: string, collapsible: boolean, relativePath: string, excludes?: string[]) {
    const children: any[] = []
    const absolutePath = path.join(__dirname, '../../' + relativePath)

    const arr = readFiles(absolutePath, excludes)

    // 排除检查的文件
    const excludesList = ['assets']
    if (excludes) {
        excludesList.push(...excludes)
    }
    
    arr.forEach(function (item) {
        if (!excludesList.includes(item)) {
            let stat = fs.lstatSync(absolutePath + '/' + item)
            if (item == 'README.md') {
                children.unshift(relativePath + '/')
            } else if (!stat.isDirectory()) {
                children.push(relativePath + '/' + item)
            } else {
                children.push(genSideBar(item, false, relativePath + '/' + item))
            }
        }
    })

    // 当一个目录下既有文件又有目录时，文件在前
    children.sort((a, b) => {
        if(typeof a === 'string' && typeof b !== 'string') {
            return -1
        } else if(typeof b === 'string' && typeof a !== 'string') {
            return 1
        }
        return 0
    })

    const frame = {
        text,
        collapsible,
        children:children
    }
    // console.log(JSON.stringify(frame))
    return frame
}

