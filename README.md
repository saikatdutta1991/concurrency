<h1 align="center">Concurrency</h1>

<div align="center">
  <h4>Distributed method level concurrency lock NestJS module backed by Redis </h4>
</div>

## Installation

2. Run npm/yarn install

```bash
npm install @saikatdutta1991/concurrency
```

## Register Module

```js
@Module({
  imports: [ConcurrencyModule.register('redis://localhost:6379')],
})
export class AppModule {}
```

## Usage

### Assume we need to apply concurrency for given method

```js
public anyMethod(args) {
...
}
```

### Simple Usecase

```js
@Concurrency({ key: 'test' })
```

### Key Generator

Pass a key generator function and `anyMethod` arguments will be passed into the generator function automatically

```js
@Concurrency({ key: (args: any) => `key_${args.customer.id}` })
```

### Set Auto Lock Release Timeout

By default lock gets released after 30 seconds. To set custom auto lock relase timeout.

```js
@Concurrency({ key: 'test', autoReleaseAfterSeconds: 40 })
```

\*Note: Lock gets released automacally regardless of function execution time.

## Author

**Saikat Dutta ([LinkedIn](https://www.linkedin.com/in/saikat-dutta-6481ba5b/))**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
