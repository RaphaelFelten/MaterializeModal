# MaterializeModal
Work more efficiently with modals from the MaterializeCSS framework.

I've been working on a SPA for our company in which I heavily used modals for all the functionality. I quickly realized that adding all those modals to the HTML file was kind of a mess and doing anything dynamic was a pain in the ass (forms, collections, ..).
That's why I've decided to develop this small library. I just wanted to share this in case someone might find it helpful. I can't really say that it's well done, I just added a bunch of stuff that I found interesting and helpful to have.

## Example:
```javascript
var modal = new Modal({
  title: 'My First Modal',
  openButton: '#open_myFirstModal',
  width: 70,
  height: 80,
  onOpen: function(modal) {
    modal.setContent('Some content');
  }
});
```

## Options:
| Name | Type | Default value | Description |
| :------------ | :------------ | :------------ | :------------ |
| type | String | `modal-fixed-footer` | Type of the modal (fixed-footer, bottom-sheet, ..) |
| width | Integer | Default width of the MaterializeCSS library | width of the modal in % |
| height | Integer | Default height of the MaterializeCSS library | height of the modal in 'vh' |
| footerButtons | String | null | Buttons which will appear in the footer of the modal - Can contain HTML |
| openButton | String | null | HTML query string of the element that opens the modal |
| windowButtons | Boolean | true | Buttons on the top right of the modal (close, minimize, maximize) |
| fixedContent | String | null | Static content - Can contain HTML |
| onOpen | Function | null | Executed each time the modal is opened. Gets two parameters: modal, data - the second argument can contain any kind of custom data which can be passed in through the open() method |
| onClose | Function | null | Executed each time the modal is closed. Gets the modal object as its argument |



## Methods:
#### open(data)
Opens the modal. If needed, custom data can be passed in to the `onOpen(modal, data)` function.
#### isOpen()
Returns a boolean value indicating if the modal is currently open.
#### close(callback)
Closes the modal. An optional callback function can be passed in that executes when the modal is closed (and gets the modal object as its parameter).
#### on(event, callback)
Binds an event (click, keypress, ...) to the modal. The callback gets the `event` data as its parameter.
#### setContent(content)
Removes all  dynamic content from the modal (the fixedContent from the options will not be affected) and sets the content passed in. The content must be a string.
#### addContent(content)
Adds content to the end of the modal. Content must be a string.
#### removeContent(selector)
Removes content based on a HTML query selection. For example:
`modal.removeContent('.myNiceDiv')`
#### setTitle(title)
Sets the title of the modal. Argument must be a string.
#### getTitle()
Returns the current title of the modal.
#### setFooterButtons(buttons)
Removes the current buttons and sets the buttons passed in (string).
#### setAttribute(attribute, value)
Sets a custom HTML attribute.
#### getAttribute(attribute)
Returns the value of the specified attribute.
#### insertForm(options)
Inserts a form.
###### Options
- width - Integer - width of the form in % - default = 100)
- imageField - Boolean - Specify if an image field should be added to the form - default = false)
- fields - An array of objects containing the form fields. Each field can be customized:
  - name - required - String - must be unique!
  - label - required - String
  - width - optional - integer - width in % - When using this on 2 or more consecutive fields and their combined values is 100 or less, the fields will be on one line.
  - type - required - String - Available types:
    - text_short (standard input)
    - text_long (textarea)
    - password (password input)
    - date (Datepicker.js library)
    - yes_no (checkbox)
    - custom (select with single selection)
    - custom_multiple (select with multiple selections)
  - chips - required if using type custom or custom_multiple. It's an array of objects containing the options.
  For example: `[{tag: '1'}, {tag: '2'}, {tag: '3'}]`

 - icon - optional - string - icon from the material-icons package
 - attributes - optional - array of objects
 For example: `[{key: 'customAttribute1', val: 'yolo'}, {key: 'customAttribute2', val: 'swag'}]`
 Tip: if you want the form field to be required, add the the attribute `{key: 'required', val: 'true'}`

#### setFormValues(values)
Sets the values for the form fields. The parameter must be an object. It should look something like this:
`{formFieldName1: 'value1', formFieldName2: 'value2', formFieldName3: 'value3', formFieldName4: 'value4',})`
In order for this to work, the property name must be equal to the name you gave the field in the 'insertForm' function.
Setting the value for type 'custom' or 'custom_multiple' requires an array with the selected element(s), the structure must be similar to the 'chips' array when creating the form field.
Setting the value for a 'yes_no' field requires a boolean value.
#### getFormValues(mode)
Returns the form values. An optional argument can be passed in to specify how the data should be structured:
`single` or `combined` - default is combined
#### getFormFields()
Returns all HTML form fields
#### getFormField(field)
Returns the specified HTML form field. Argument must be a string equal to the name of the field given in the `insertForm` function
#### clearForm()
Clears the form.
#### hideFormField(fields)
Hides one or more form fields. Argument is an array of fields. Each element in the array must be a string equal to the name of the field given in the `insertForm` function.
#### formFieldChange(event, field, callback)
Adds an event listener to a form field (change, keyup, keypress, ..). The callback gets the `event` data.
#### displayImage(src)
Adds an image to the modal.
#### displayFormImage(src)
Adds the path of the image to the already existing image field.
#### hideFormImageDeleteButton()
Hides the delete button of the image field.
#### showFormImageDeleteButton()
Shows the delete button of the image field.
#### removeImage()
Removes the image.
#### getImage()
Returns a `FormData` object the selected image.
#### hideDropzone()
Hides the Dropzone field.
#### addChipsField(chips)
Adds a chips field to the form - the argument is an array of chips equal to the structure of chips in a form field.
#### insertCollection(options)
Inserts a collection.
###### Options:
- width - Integer - Width of the collection in % - default = 100
- sortable - Boolean - Indicates if the collection items should be sortable - works with the library Sortable.js
- searchBar - Boolean - Indicates if a search bar should be added
- items - required - Array - Array of objects.
Each item has a couple of properties:
  - label - required - String - The label of the item
  - attributes - optional - Object - Custom HTML attributes.
  For example: `{customAttr1: 'yolo', customAttr2: 'swag'}`
  - secondaryContent - optional - Array - Array of secondary-content items
  Each item has some properties:
    - icon - required - String - A material-icons icon string
    - class - optional - String - A custom class for the item
    - color - optional - String - Hexadecimal color string
    - tooltip - optional - String - Tooltip for the item
  - onInserted - Function - Executed when the collection has been inserted
#### getCollection()
Returns the HTML collection.
#### getCollectionItems()
Returns all HTML collection items.

## Helper
##### Submit form by pressing the Enter key
Adding the class 'modal-submit-form' to an element triggers its click event when pressing the Enter key
