const {select, input, checkbox} = require ('@inquirer/prompts');
const { stringify } = require('querystring');
const fs = require('fs').promises

let mensagem = "Bem vindo ao app de metas!";
let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch (erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
  const Meta = await input ({message: "digite a meta"})

  if(Meta.length == 0 ) {
    mensagem ='a meta nao pode ser vazia'
    return
  }
  metas.push(
    {value: Meta, checked: false
  })

  mensagem = "meta cadastrada!"
}

const listarMetas = async () => {
  if(metas.length == 0 ){
    return
  }
  const respostas = await checkbox({
    message : 'use as setas para navegar, espaço para marcar e desmarcar, enter para finalizar etapa',
    choices: [...metas],
    instructions: false,
  })
  
  metas.forEach((m) => {
    m.checked = false
  })

  if(respostas.length == 0) {
   mensagem ="nenhuma meta selecionada"
    return
  }



  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta
    })

    meta.checked = true
  })
  mensagem = 'metas marcadas como concluidas!'

}

  const metasRealizadas = async () => {
    if(metas.length == 0 ){
      return
    }
    const realizadas = metas.filter ((meta) => {
      return meta.checked
    })

    if(realizadas.length == 0 ) {
      mensagem = 'nao existem metas concluidas :/'
      return
    }

    await select ({
      message: "metas concluidas: " + realizadas.length,
      choices: [...realizadas]
    })
  }

  const metasAbertas = async () => {
    if(metas.length == 0 ){
      return
    }
    const abertas = metas.filter((meta) => {
      return meta.checked != true
    })

    if(abertas.length == 0) {
      mensagem = "nao existem metas abertas :)"
      return
    }

    await select ({
      message: "metas abertas: " + abertas.length,
      choices: [...abertas]
    })
  }

  const deletarMetas = async () => {
    if(metas.length == 0 ){
      return
    }
    const metasDesmarcadas = metas.map((meta) => {
      return {value: meta.value, checked: false}
    })
    const itemsADeletar = await checkbox({
      message : 'selecione item para deletar',
      choices: [...metasDesmarcadas],
      instructions: false,
    })

    if (itemsADeletar.length == 0) {
     mensagem ="nenhum item para deletar"
      return
    }

    itemsADeletar.forEach((item) => {
      metas = metas.filter((meta) => {
        return meta.value != item
      })
    })

    message = ("metas deletadas com sucesso")
  }

  const mostrarMensagem = () => {
    console.clear();

    if (mensagem != "") {
      console.log(mensagem)
      console.log('')
      mensagem = ""
    }
  }

const start = async () => {
   await carregarMetas()

  while(true){
    mostrarMensagem()
    await salvarMetas()

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