# Caveats

I hit a couple roadblocks with the assignment.  The browser blocks Reddit's json response with CORS errors.  I used the [pushshift api](https://github.com/pushshift/api) to work around this.  However, pushshift doesn't include the thumbnail for submissions, so I used an image api to fake them.  The api didn't seem the most important part of the assignment, so I assumed this was acceptable.

## Running the App

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Solution

The solution is designed to provide the user with responsive feedback.  Often interfaces that load data in the background will seem frozen or show incorrect information while data is being loaded.  This solution solves this by using a discriminated union to describe the state of the request; everything from failures to unstarted requests.  This can seem verbose at first, but in a more complete application this would be encapsulated in a reusable component.

The `Listing` component is the point of composition; it's really the core of the UI lives, so it's important that this component have good test coverage and that's possible because it has no side effects.  The side effects (i.e. the fetch calls) are abstracted away from it, in this case in the `reddit` page.  This abstraction makes the component very easy to test.  In a larger app, the code that lives in the `reddit` page would likely be handled in a state store; thus all the components would be free of side effects and easily testable.

Finally, I want to point out the `http` function.  One of the most difficult things in writing production javascript is dealing with exceptions.  They can be of any type, they are not very well-documented, and they are hard to discriminate.  My preferred solution to this problem is to model both the successful response and the error responses as a discriminted union on the success-side of the promise.  This forces the developer to deal with errors in the calling code and it makes error logging much nicer.

## Folder structure

I generally use this folder structure:
```
.
+- components     // this are small reusuable components
|  +- component1.tsx
|  +- component1.test.tsx
|  +- component2.tsx
|  +- component2.test.tsx
+- features       // for large applications, I use this large components, like the listing component
|  +- feature1.tsx
+- pages
|  +- page1.tsx   // this are routable components, they represent top level elements
+- services       // this is for apis, like the reddit api here
|  +- service1.tsx
+- utils          // this is for reusable types and functions.
|  +- async.ts  
```

If I'm using a state store, I will also have a `store` folder for that.

Additionally, when the solution is using a css file per component, like with css modules, then I will put each component with it's test and css file in it's own folder and create an `index.ts` file to forward the component.  It's also useful to create an `index.ts` file at the root of the `components` folder to bundle the components making them easy to use from `features` and `pages`.

## Tech Stack

I used create-react-app to scaffold the project.  It's the quickest way to setup a React project.  I took a shortcut with CSS here, the solution includes a css library (Bulma) for no other reason than time.  I wanted to focus my time on the behavior and structure of the app, not css.  That said, generally, my approach to css is css modules.  They avoid the css specificity rules and just make css easier to write.

## Areas of Improvement

### Appearance

With more time I would have handcrafted the CSS.  The app could use a lot of polish; loading screens, error screens, better layout, etc.

The app would also benefit from debouncing the search input, this would prevent it from creating a request with every keystroke.  Instead, creating a request when the user stops typing.

### Testing

I had planned to write unit tests for _all_ of the components, but I ran out of time.  This is clearly a big area for improvement.

### State Management

I think a state management library could improve the code in several ways.  As I mentioned, moving the code out of the reddit page would support more testing and it would simplify the logic in a few places.

### Additional Utility Methods

Most of the complexity of the code is dealing with discriminated unions.  This can be mitigated with factories, type guards, and helper methods like `map`.  It would make the code easier to read and write.