const {select, input, checkbox} = require ('@inquirer/prompts')

let meta = {
  value: "tomar 2l de agua por dia",
  checked: false,
}

let metas =[ meta ]

const cadastrarMeta = async () => {
  const Meta = await input ({message: "digite a meta"})

  if(Meta.length == 0 ) {
    console.log('a meta nao pode ser vazia')
    return
  }
  metas.push(
    {value: Meta, checked: false
  })
}

const listarMetas = async () => {
  const respostas = await checkbox({
    message : 'use as setas para navegar, espaço para marcar e desmarcar, enter para finalizar etapa',
    choices: [...metas],
    instructions: false,
  })

  if(respostas.length == 0) {
    console.log("nenhuma meta selecionada")
    return
  }

  metas.forEach((m) => {
    m.checked = false
  })

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta
    })

    meta.checked = true
  })
  console.log('metas marcadas como concluidas!')

}

  const metasRealizadas = async () => {
    const realizadas = metas.filter ((meta) => {
      return meta.checked
    })

    if(realizadas.length == 0 ) {
      console.log('nao existem metas concluidas :/')
      return
    }

    await select ({
      message: "metas concluidas",
      choices: [...realizadas]
    })
  }

const start = async () => {
  while(true){
    const opcao = await select ({
      message: 'menu >',
      choices: [
        {
          name: 'cadastrar meta',
          value: "cadastrar"
        },
        {
          name: 'listar metas',
          value: 'listar'
        },
        {
          name: 'metas realizadas',
          value: 'realizadas'
        },
        {
          name: 'sair',
          value: 'sair'
        }
      ]
    })
    
    switch(opcao) {
      case "cadastrar":
        await cadastrarMeta()
        console.log(metas)
        break
      case "listar":
        await listarMetas()
        break
      case "realizadas":
          await metasRealizadas()
          break
      case "sair":
          console.log('ate a proxima')
          return
    }
  }
}

start ()