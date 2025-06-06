## Visualize Pull Requests do repositório TabNews com um design familiar!

Inicialmente, o código foi escrito em HTML, CSS e JS, testado localmente. No entanto, ao deparar com deploy para [Netlify](https://netlify.com), tive que me adaptar para `Nodejs`. Conforme Netlify, arquivo chamado `toml` prepara o ambiente a ser configurado, semelhante ao caso da [Vercel](https://vercel.com). Criado, tive que implementar um proxy devido ao CORS. Para contornar isso, usei [CORSPROXY](https://corsproxy.io/), pois ela garante altas requisições. 

Dito isso, o projeto está hospedado gratuitamente e sem anúncios. Você pode acompanhar as alterações do TabNews de forma amigável. Com objetividade você consegue entender os _Pull Request_, sejam eles com status de _closed_ ou _open_. Além de filtrar por opções: PACTH e DIFF. 

- PACTH --------> É a "conversa completa" do autor ou quem mais estiver participando.
- DIFF -----------> Apenas às diferenças do código, do antes e depois, simplificado. 

Você gosta de tecnologia, mas não entende ou até assusta ao ver o que foi feito `commit`. Não se preocupe, integrei minha [API](http://ask-jetrom.vercel.app/) usando Gemini (modelo flash 1.5 pro) com instruções no [back end](https://github.com/Jeiel0rbit/ask-Jetrom), que irão facilitar o entendimento.

- `Note` ---------> Configurei API para permitir até 10 requisições por IP, mais bloqueio de 1 hora.

![](https://i.imgur.com/QXQrGIT.png)
> Eu me responsabilizo, mas não garanto a disponibilidade 98% (1% por força maior + 1% sem garantia minha). Para pequenos projetos, penso que isso é suficiente.

## Agora veja pequena demonstração:

![](https://github.com/user-attachments/assets/a4e71b27-cd02-4efc-a1f8-4f1b9c9248cb)
> ~ 1:10 min.
