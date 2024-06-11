## Example usage

```ts
class ButtonController extends BaseController {
  @Param text!: ParamType<string>;
  @Param numberOfImpressions!: ParamType<number>;

  handleClick = () => {
    for (let i = 0; i < this.numberOfImpressions; i++) {
      alert(this.text);
      this.emit('updated');
    }
  };
}
```