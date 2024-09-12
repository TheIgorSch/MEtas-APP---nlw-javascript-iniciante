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
  
  metas.forEach((m) => {
    m.checked = false
  })

  if(respostas.length == 0) {
    console.log("nenhuma meta selecionada")
    return
  }



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
      message: "metas concluidas: " + realizadas.length,
      choices: [...realizadas]
    })
  }

  const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
      return meta.checked != true
    })

    if(abertas.length == 0) {
      console.log("nao existem metas abertas :)")
      return
    }

    await select ({
      message: "metas abertas: " + abertas.length,
      choices: [...abertas]
    })
  }

  const deletarMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
      return {value: meta.value, checked: false}
    })
    const itemsADeletar = await checkbox({
      message : 'selecione item para deletar',
      choices: [...metasDesmarcadas],
      instructions: false,
    })

    if (itemsADeletar.length == 0) {
      console.log ("nenhum item para deletar")
      return
    }

    itemsADeletar.forEach((item) => {
      metas = metas.filter((meta) => {
        return meta.value != item
      })
    })

    console.log ("metas deletadas com sucesso")
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
          name: 'metas abertas',
          value: 'abertas'
        },
        {
          name: 'deletar metas',
          value: 'deletar'
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
      case "abertas":
          await metasAbertas()
          break
      case "deletar":
          await deletarMetas()
          break
      case "sair":
          console.log('ate a proxima')
          return
    }
  }
}

start ()