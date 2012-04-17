Collection     = require('lib/collection')
Shadow         = require('app/models/properties/shadow')
ColorPicker    = require('lib/color_picker')
PositionPicker = require('lib/position_picker')
Popup          = require('lib/popup')

class BoxShadowEdit extends Spine.Controller
  className: 'edit'

  events:
    'change input': 'inputChange'

  elements:
    'input[name=x]': '$x'
    'input[name=y]': '$y'
    'input[name=blur]': '$blur'
    'input': '$inputs'

  constructor: ->
    super
    @change(@shadow)

  change: (@shadow = new Shadow) ->
    @render()

  render: ->
    @$color = new ColorPicker.Preview(
      color: @shadow.color
    )

    @$color.bind 'change', (color) => @inputChange()

    @$position = new PositionPicker

    @$position.bind 'change', (position) =>
      @shadow.x = position.left
      @shadow.y = position.top
      @trigger 'change', @shadow
      @update()

    @html JST['app/views/inspector/box_shadow'](@)
    @$('input[type=color]').replaceWith(@$color.el)
    @$('input[type=position]').replaceWith(@$position.el)

    @update()
    this

  update: ->
    @$inputs.attr('disabled', @disabled)

    @$position.change(
      left: @shadow.x, top: @shadow.y
    )

    @$x.val @shadow.x
    @$y.val @shadow.y
    @$blur.val @shadow.blur
    @$color.val @shadow.color

  inputChange: (e) ->
    @shadow.x     = parseFloat(@$x.val())
    @shadow.y     = parseFloat(@$y.val())
    @shadow.blur  = parseFloat(@$blur.val()) or 0
    @shadow.color = @$color.val()

    @trigger 'change', @shadow
    @update()

  release: ->
    @$color?.release()
    @$position?.release()
    super

class BoxShadowList extends Spine.Controller
  className: 'list'

  events:
    'click .item': 'click'
    'click button.plus': 'addShadow'
    'click button.minus': 'removeShadow'

  constructor: ->
    super
    throw 'shadows required' unless @shadows
    @shadows.change @render

  render: =>
    @html JST['app/views/inspector/box_shadow/list'](@)

    @$('.item').removeClass('selected')
    selected = @$('.item').get(@shadows.indexOf(@current))
    $(selected).addClass('selected')
    this

  click: (e) ->
    @current = @shadows[$(e.currentTarget).index()]
    @trigger 'change', @current
    @render()

  addShadow: ->
    @shadows.push(@current = new Shadow(blur: 3))
    @trigger 'change', @current

  removeShadow: ->
    @shadows.remove(@current)
    @current = @shadows.first()
    @trigger 'change', @current

class BoxShadow extends Spine.Controller
  className: 'boxShadow'

  render: ->
    @disabled = not @stage.selection.isAny()
    @el.toggleClass('disabled', @disabled)

    @shadows  = @stage.selection.get('boxShadow')
    @shadows = new Collection(@shadows)
    @current = @shadows.first()
    @shadows.change @set

    @el.empty()

    # BoxShadow List

    @el.append($('<h3/>').text('Shadow'))

    @list = new BoxShadowList
      current:  @current
      shadows:  @shadows
      disabled: @disabled

    @list.bind 'change', (@current) =>
      @edit.change @current

    @append @list.render()

    # BoxShadow Edit

    @edit = new BoxShadowEdit
      shadow:   @current
      disabled: @disabled

    @edit.bind 'change', => @shadows.change(arguments...)
    @append @edit

    this

  set: (shadow) =>
    if shadow
      @shadows.push(shadow) unless @shadows.include(shadow)

    @stage.history.record('boxShadow')
    @stage.selection.set('boxShadow', @shadows.valueOf())

  release: ->
    @list?.release()
    @edit?.release()
    @shadows?.unbind()
    super

module.exports = BoxShadow