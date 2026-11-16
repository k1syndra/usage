# usage

A Claude Code mod that keeps your plan usage in the status line under the prompt:

`[5h: 17% # 4h 24m | week: 35% # 3h 0m | Context: 23% # 210.2k/1m]`

- `5h` and `Week` are your plan's rolling limits: percent used, then time until the window resets.
- `Context` is how full the model's context window is.
- It refreshes after every response and once a minute.
- Shown only on subscription plans; with an API key there are no plan limits and the line stays empty.

## Install

At the prompt of a terminal session:

```
/plugin install usage --marketplace k1syndra/usage
```

Answer `y` to add the marketplace, then pick a scope. Restart the session if the line does not appear.

## License

MIT
