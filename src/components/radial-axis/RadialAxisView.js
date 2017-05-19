import _ from 'lodash'
import * as d3Axis from 'd3-axis'
import * as d3Ease from 'd3-ease'
import ChartView from 'chart-view'
import Config from './RadialAxisConfigModel'
import './radial-axis.scss'

export default class RadialAxisView extends ChartView {
  static get Config () { return Config }

  constructor (...args) {
    super(...args)
    this.render()
  }
  get tagName () { return 'g' }

  get zIndex () { return 0 }
  /**
   * follow same naming convention for all XY chart sub views
   */
  get selectors () {
    return _.extend(super.selectors, {
      node: '.axis',
      label: '.axis-label',
      tick: '.tick',
    })
  }
  /**
   * Axis is rendered outside the container inner (width * height) area on margins
   */
  render () {
    if (!this.config.scale) return
    super.render()

    const margin = this.config.get('margin')
    this.d3
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .classed(this.config.name, true)

    console.log('RadialAxis config: ', this.config)
    console.log('RadialAxis scale domain: ', this.config.scale.domain())
    console.log('RadialAxis scale range: ', this.config.scale.range())

    /*
    this._d3Axis = d3Axis[_.camelCase(`axis-${this.config.position}`)](this.config.scale)
      .ticks(this.config.get('ticks'))
      .tickSize(this._tickLength * this.config.side)
      .tickPadding(10)

    if (this.config.formatter) this._d3Axis.tickFormat(this.config.formatter)
    if (this.config.tickCoords) this._d3Axis.tickValues(this.config.tickValues)

    this.d3.transition().ease(d3Ease.easeLinear).duration(this.config.duration)
    this.d3.call(this._d3Axis)
    this._renderLabel()
    */

    this._ticking = false
  }
  /**
   * Labels are rendered at the center along axis
   * TODO not optimal label spacing
   * and in the first quater of the margin between container edge and tick
   */
  _renderLabel () {
    const offset = {
      along: this._plotLength / 2,
      across: this._tickLength * +(this.config.location === 'end') +
        this.config.get('margin.' + this.config.position) * 0.75 * this.config.side,
    }

    const labels = this.d3.selectAll(this.selectors.label)
      .data(this.config.labels)
    labels
      .enter()
      .append('text')
      .attr('class', this.selectorClass('label'))
      .text(d => d)
      .merge(labels)
      .attr('transform', (d, i) => {
        offset.across += i * this.config.get('margin.label') * this.config.side
        const position = this.config.isHorizontal ? [offset.along, offset.across] : [offset.across, offset.along]

        return `translate(${position[0]}, ${position[1]})
          rotate(${90 * this.config.side * +!this.config.isHorizontal})`
      })

    labels.exit().remove()
  }
}
