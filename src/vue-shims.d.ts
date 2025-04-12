// 이 파일은 `TypeScript`가 `.vue` 파일을 모듈로 인식하게 하는 데 필요한 최소한의 설정이다.
// vscode에서는 이 파일이 없어도 vue파일을 잘 인식하지만 neovim에서는 그렇지 못하다.
// neovim 확장을 사용하고 있기에 메세지는 고스란히 vscode에서 보여진다.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    NonNullable<unknown>,
    NonNullable<unknown>,
    unknown
  >
  export default component
}
