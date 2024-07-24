# Hide Slides

Plugin for Reveal.js that prevents users from viewing slides bigger than a configured numbers

## Configuration
You should configure your Reveal.js dependencies to include the Hide Slides plugin

```javascript
// Optional reveal.js plugins
dependencies: [{
        src: 'plugin/hide-slides/index.js',
        async: true
}]
```

The path to the configuration file should be placed inside the reval configuration section

```javascript
Reveal.initialize({
  limits: {
    path: 'limits/limits.json'
  }
)}

```

The configuration bellow will not allow slides beyond horizontal 10 and vertical 9 to be presented.

```json
{
    "h" : 10,
    "v" : 9
}
```
