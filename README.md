# Angular-spy
Flexible set of directives and utilities that allow you to listen to scrolling within any DOM element.
Angular-spy exposes a main **spy-scroll-container** directive in charge of registering events on the scroller and allows to easily build custom spy directives to deal with different use-cases.

The module comes with a **spy-visible** directive that sets the binding to true when the element is fully visible
and sets it back to false when is fully hidden.


## Installation

Bower:
```
bower install angular-spy
```

Npm:
```
npm install angular-spy
```

## Usage
```
<body ng-app="example" spy-scroll-container>
    <section class="yellow"></section>
    <section class="green" spy-visible="greenVisible"></section>
    <section class="red" spy-visible="redVisible"></section>
</body>
```

If this case the body represents the main scroller; once the section spied gets
to be fully visible in view the respective binding is set.

### Build your own spies.
When dealing with scroll spies, it's easy to end up in really specific scenarios.
I really wanted something easy to use and provide a base infrastructure to allow developers to write their own
spies.
The spies share a common interface, and can just require the spy-scroll-container
to get the scroll position. Please have a look to visible.directive.js source to
have an idea.

## Usage

[MIT License](https://opensource.org/licenses/MIT)
