/*******************************************************************************
 * Copyright (c) 2011, 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/

rwt.protocol.AdapterRegistry.add( "rwt.widgets.ScrollBar", {

  factory : function( properties ) {
    // NOTE : In this case the parent HAS to be already created by the protocol
    var styleMap = rwt.protocol.AdapterUtil.createStyleMap( properties.style );
    var parent = rwt.protocol.ObjectRegistry.getObject( properties.parent );
    var result;
    if( styleMap.HORIZONTAL ) {
      result = parent.getHorizontalBar();
    } else {
      result = parent.getVerticalBar();
    }
    return result;
  },

  destructor : function() {},

  properties : rwt.protocol.AdapterUtil.extendControlProperties( [
    "visibility"
  ] ),

  propertyHandler : {
    "visibility" : function( widget, value ) {
      var parent = widget.getParent();
      // NOTE : use parent.getXXXBarVisible because "visibility" or "display" my be used
      // TODO [tb] : alwas use display
      if( widget.isHorizontal() ) {
        parent.setScrollBarsVisible( value, parent.isVerticalBarVisible() );
      } else {
        parent.setScrollBarsVisible( parent.isHorizontalBarVisible(), value );
      }
    }
  },

  listeners : rwt.protocol.AdapterUtil.extendControlListeners( [
    "Selection"
  ] ),

  listenerHandler : {
    "Selection" : function( widget, value ) {
      widget.setHasScrollBarsSelectionListener( value );
    }
  },

  methods : []

} );
