/*******************************************************************************
 * Copyright (c) 2010, 2011 EclipseSource and others. All rights reserved.
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   EclipseSource - initial API and implementation
 ******************************************************************************/

qx.Class.define( "org.eclipse.rwt.test.tests.TreeRowTest", {

  extend : qx.core.Object,


  // TODO [tb] : Since TreeRow has been refactored to work without reference to Tree, the 
  //             tests could also be refactored to not use the an tree instance anymore. 
  members : {

    testCreateRow : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      assertTrue( row.isCreated() );
      assertEquals( 0, row._getTargetNode().childNodes.length );
      tree.destroy();
      row.destroy();
    },

    testRenderItem : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 2, row._getTargetNode().childNodes.length );
      assertEquals( "Test", row._getTargetNode().childNodes[ 1 ].innerHTML );
      tree.destroy();
      row.destroy();
    },

    testRenderEmptyItem : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 1, row._getTargetNode().childNodes.length );
      tree.destroy();
      row.destroy();
    },

    testRenderNoItem : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      row.renderItem( null );
      assertEquals( 0, row._getTargetNode().childNodes.length );
      tree.destroy();
      row.destroy();      
    },

    testRenderItemTwice : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 2, row._getTargetNode().childNodes.length );
      assertEquals( "Test", row._getTargetNode().childNodes[ 1 ].innerHTML );
      tree.destroy();
      row.destroy();
    },

    testTreeColumnMetrics : function() {
      var tree = new org.eclipse.rwt.widgets.Tree( { 
        "appearance": "tree",
        "indentionWidth" : 16
      } );
      var item = new org.eclipse.rwt.widgets.TreeItem( tree.getRootItem() );
      item.setTexts( [ "Test" ] );      
      tree.setItemMetrics( 0, 10, 50, 12, 13, 30, 8 );
      var row = this._createRow( tree );
      assertEquals( 10, row._getItemLeft( item, 0, tree._config) );      
      assertEquals( 50, row._getItemWidth( item, 0, tree._config ) );      
      assertEquals( 28, row._getItemImageLeft( item, 0, tree._config ) );      
      assertEquals( 13, row._getItemImageWidth( item, 0, tree._config ) );      
      assertEquals( 46, row._getItemTextLeft( item, 0, tree._config ) );      
      assertEquals( 8, row._getItemTextWidth( item, 0, tree._config ) );
      tree.destroy();
    },
    
    testFirstColumnMetricsImageOverflow : function() {
      var tree = new org.eclipse.rwt.widgets.Tree( { 
        "appearance": "tree",
        "indentionWidth" : 10
      } );
      var item = new org.eclipse.rwt.widgets.TreeItem( tree.getRootItem() );
      item.setTexts( [ "Test" ] );      
      tree.setItemMetrics( 0, 0, 15, 0, 10, 10, 40 );
      var row = this._createRow( tree );
      assertEquals( 5, row._getItemImageWidth( item, 0, tree._config ) );      
      assertEquals( 0, row._getItemTextWidth( item, 0, tree._config ) );
      tree.destroy();
    },

    testSecondColumnAsTreeColumn : function() {
      var tree = new org.eclipse.rwt.widgets.Tree( { 
        "appearance": "tree",
        "indentionWidth" : 16
      } );
      var item = new org.eclipse.rwt.widgets.TreeItem( tree.getRootItem() );
      var row = this._createRow( tree );
      item.setTexts( [ "Test", "Test2" ] );      
      tree.setItemMetrics( 0, 64, 40, 66, 13, 69, 8 );
      tree.setItemMetrics( 1, 34, 40, 36, 13, 49, 8 );
      tree.setTreeColumn( 1 );
      // first column is unchanged:
      assertEquals( 64, row._getItemLeft( item, 0, tree._config ) );      
      assertEquals( 40, row._getItemWidth( item, 0, tree._config) );      
      assertEquals( 66, row._getItemImageLeft( item, 0, tree._config ) );      
      assertEquals( 13, row._getItemImageWidth( item, 0, tree._config ) );      
      assertEquals( 69, row._getItemTextLeft( item, 0, tree._config ) );      
      assertEquals( 8,  row._getItemTextWidth( item, 0, tree._config ) );
      // second column       
      assertEquals( 34, row._getItemLeft( item, 1, tree._config ) );      
      assertEquals( 40, row._getItemWidth( item, 1, tree._config ) );      
      assertEquals( 52, row._getItemImageLeft( item, 1, tree._config ) );      
      assertEquals( 13, row._getItemImageWidth( item, 1, tree._config ) );      
      assertEquals( 65, row._getItemTextLeft( item, 1, tree._config ) );      
      assertEquals( 8,  row._getItemTextWidth( item, 1, tree._config ) );
      tree.destroy();
    },

    testGetCheckBoxMetrics : function() {
      var tree = new org.eclipse.rwt.widgets.Tree( { 
        "appearance": "tree",
        "check": true,
        "checkBoxMetrics": [ 5, 20 ],
        "indentionWidth" : 16
      } );
      var item = new org.eclipse.rwt.widgets.TreeItem( tree.getRootItem() );
      var row = this._createRow( tree );
      assertEquals( 21, row._getCheckBoxLeft( item, tree._config ) );
      assertEquals( 20, row._getCheckBoxWidth( item, tree._config ) );
      tree.destroy();
    },

    testSetCheckBoxMetricsOverflow : function() {
      var tree = new org.eclipse.rwt.widgets.Tree( { 
        "appearance": "tree",
        "check" : true,
        "checkBoxMetrics" : [ 5, 20 ],
        "indentionWidth" : 10        
      } );
      var item = new org.eclipse.rwt.widgets.TreeItem( tree.getRootItem() );
      var row = this._createRow( tree );
      tree.setItemMetrics( 0, 0, 25, 0, 10, 10, 40 );
      assertEquals( 15, row._getCheckBoxLeft( item, tree._config ) );
      assertEquals( 10, row._getCheckBoxWidth( item, tree._config ) );
      tree.destroy();
    },

    testLabelBounds : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      row.setHeight( 15 );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode();
      assertEquals( 2, node.childNodes.length );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var bounds = testUtil.getElementBounds( node.childNodes[ 1 ] );
      assertEquals( 0, bounds.top );
      assertEquals( 21, bounds.left );
      assertEquals( 15, bounds.height );
      assertEquals( 45, bounds.width );
      tree.destroy();
      row.destroy();
    },
     
    testRenderMultipleLabels : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setItemMetrics( 2, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 3 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1", "Test2", "Test3" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 4, row._getTargetNode().childNodes.length );
      assertEquals( "Test1", row._getTargetNode().childNodes[ 1 ].innerHTML );
      assertEquals( "Test2", row._getTargetNode().childNodes[ 2 ].innerHTML );
      assertEquals( "Test3", row._getTargetNode().childNodes[ 3 ].innerHTML );
      tree.destroy();
      row.destroy();
    },

    testIgnoreItemWidthZero : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 0, 50, 12, 65, 12 );
      tree.setItemMetrics( 2, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 3 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1", "Test2", "Test3" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 3, row._getTargetNode().childNodes.length );
      assertEquals( "Test1", row._getTargetNode().childNodes[ 1 ].innerHTML );
      assertEquals( "Test3", row._getTargetNode().childNodes[ 2 ].innerHTML );
      tree.destroy();
      row.destroy();
    },

    testLabelDefaultStyle : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      node = row._getTargetNode().childNodes[ 1 ];
      assertEquals( 3, parseInt( node.style.zIndex ) );
      assertEquals( "absolute", node.style.position );
      assertEquals( "middle", node.style.verticalAlign );
      assertEquals( "nowrap", node.style.whiteSpace );
      assertEquals( "hidden", node.style.overflow );
      assertFalse( row.getSelectable() );
      tree.destroy();
      row.destroy();
    },

    testLabelDecoration : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {};
          result.itemBackground = "blue";
          result.itemForeground = "white";
          result.textDecoration = "line-through";
          return result;
        }
      } );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      node = row._getTargetNode().childNodes[ 1 ];
      assertEquals( "line-through", node.style.textDecoration );
      tree.destroy();
      row.destroy();
    },

    testRenderNoElementForEmptyText : function() {
      var tree = this._createTree();
      tree._columnCount = 2;
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test", "" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 2, row._getTargetNode().childNodes.length );
      tree.destroy();
      row.destroy();
    },
    
    testHideUnneededElements : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test", "Test" ] );
      row.renderItem( item, tree._config, false, null );
      item.setTexts( [ "Test", "" ] );
      row.renderItem( item, tree._config, false, null );
      var element = row._getTargetNode().childNodes[ 2 ];
      assertEquals( "none", element.style.display );
      tree.destroy();
      row.destroy();
    },

    testShowHiddenElements : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test", "Test" ] );
      row.renderItem( item, tree._config, false, null );
      item.setTexts( [ "Test", "" ] );
      row.renderItem( item, tree._config, false, null );
      item.setTexts( [ "Test", "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var element = row._getTargetNode().childNodes[ 2 ];
      assertEquals( "", element.style.display );
      tree.destroy();
      row.destroy();
    },
    
    testSingleItemTreeLine : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 2, row._getTargetNode().childNodes.length );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var node = row._getTargetNode().childNodes[ 0 ];
      var url = testUtil.getCssBackgroundImage( node );
      assertTrue( url.indexOf( "single.gif" ) != -1 );
      var position = node.style.backgroundPosition;
      assertTrue(    position.indexOf( "center" ) != -1 
                  || position.indexOf( "50%" ) != -1 );
      tree.destroy();
      row.destroy();
    },
    
    testRenderIndentSymbolsForParents : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var parent1 = this._createItem( tree, false, true );
      var parent2 = this._createItem( parent1, false, false );
      var parent3 = this._createItem( parent2, false, true );
      var item = this._createItem( parent3, true, false );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 4, row._getTargetNode().childNodes.length );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      var indentSymbol1 = testUtil.getCssBackgroundImage( nodes[ 2 ] );
      assertTrue( indentSymbol1.indexOf( "line.gif" ) != -1 );
      var indentSymbol2 = testUtil.getCssBackgroundImage( nodes[ 1 ] );
      assertTrue( indentSymbol2.indexOf( "line.gif" ) != -1 );
      var urlEnd = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( urlEnd.indexOf( "end.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },
  
    testIndentSymbolsPosition : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var parent1 = this._createItem( tree, false, true );
      var parent2 = this._createItem( parent1, false, false );
      var parent3 = this._createItem( parent2, false, true );
      var item = this._createItem( parent3, true, false );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      assertEquals( 0, testUtil.getElementBounds( nodes[ 2 ] ).top );
      assertEquals( 0, testUtil.getElementBounds( nodes[ 1 ] ).top );
      assertEquals( 0, testUtil.getElementBounds( nodes[ 0 ] ).top );
      assertEquals( 0, testUtil.getElementBounds( nodes[ 2 ] ).left );
      assertEquals( 32, testUtil.getElementBounds( nodes[ 1 ] ).left );
      assertEquals( 48, testUtil.getElementBounds( nodes[ 0 ] ).left );
      tree.destroy();
      row.destroy();
    },
  
    testIndentSymbolsNotEnoughSpace : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var parent1 = this._createItem( tree, false, true );
      var parent2 = this._createItem( parent1, false, true );
      var item = this._createItem( parent2, true, false );
      var nodes = row._getTargetNode().childNodes;
      tree.setItemMetrics( 0, 0, 15, 24, 10, 5, 45 );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 0, nodes.length );
      tree.setItemMetrics( 0, 0, 16, 24, 10, 5, 45 );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 1, nodes.length );
      tree.setItemMetrics( 0, 0, 47, 24, 10, 5, 45 );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 2, nodes.length );
      tree.setItemMetrics( 0, 0, 100, 20, 10, 5, 45 );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 3, nodes.length );
      tree.destroy();
      row.destroy();
    },

    testIndentSymbolsDimension : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      row.setHeight( 15 );
      this._addToDom( row );
      var parent1 = this._createItem( tree, false, true );
      var parent2 = this._createItem( parent1, false, false );
      var parent3 = this._createItem( parent2, false, true );
      var item = this._createItem( parent3, true, false );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      assertEquals( 16, testUtil.getElementBounds( nodes[ 2 ] ).width );
      assertEquals( 16, testUtil.getElementBounds( nodes[ 1 ] ).width );
      assertEquals( 16, testUtil.getElementBounds( nodes[ 0 ] ).width );
      assertEquals( 15, testUtil.getElementBounds( nodes[ 2 ] ).height );
      assertEquals( 15, testUtil.getElementBounds( nodes[ 1 ] ).height );
      assertEquals( 15, testUtil.getElementBounds( nodes[ 0 ] ).height );
      tree.destroy();
      row.destroy();
    },
    
    testIndentSymbolFirstItemOfLayer : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree, false, true );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      var startSymbol = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbol.indexOf( "start.gif" ) != -1 );
      item.setItemCount( 3 );
      new org.eclipse.rwt.widgets.TreeItem( item, 2 )
      row.renderItem( item, tree._config, false, null );
      var startSymbolCollapsed = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbolCollapsed.indexOf( "start-collapsed.gif" ) != -1 );
      item.setExpanded( true );
      row.renderItem( item, tree._config, false, null );
      var startSymbolExpanded = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbolExpanded.indexOf( "start-expanded.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },
    
    testIndentSymbolLastItemOfLayer : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree, true, false );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      var startSymbol = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbol.indexOf( "end.gif" ) != -1 );
      item.setItemCount( 3 );
      new org.eclipse.rwt.widgets.TreeItem( item, 2 );
      row.renderItem( item, tree._config, false, null );
      var startSymbolCollapsed = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbolCollapsed.indexOf( "end-collapsed.gif" ) != -1 );
      item.setExpanded( true );
      row.renderItem( item, tree._config, false, null );
      var startSymbolExpanded = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbolExpanded.indexOf( "end-expanded.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },
    
    testIndentSymbolIntermediateItemOfLayer : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree, true, true );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      var startSymbol = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbol.indexOf( "intermediate.gif" ) != -1 );
      item.setItemCount( 4 );
      new org.eclipse.rwt.widgets.TreeItem( item, 3 );
      row.renderItem( item, tree._config, false, null );
      var startSymbolCollapsed = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbolCollapsed.indexOf( "intermediate-collapsed.gif" ) != -1 );
      item.setExpanded( true );
      row.renderItem( item, tree._config, false, null );
      var startSymbolExpanded = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbolExpanded.indexOf( "intermediate-expanded.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },

    testIndentSymbolSingleItemOfFirstLayer : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree, false, false );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      var startSymbol = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbol.indexOf( "single.gif" ) != -1 );
      item.setItemCount( 2 );
      new org.eclipse.rwt.widgets.TreeItem( item, 1 );
      row.renderItem( item, tree._config, false, null );
      var startSymbolCollapsed = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbolCollapsed.indexOf( "single-collapsed.gif" ) != -1 );
      item.setExpanded( true );
      row.renderItem( item, tree._config, false, null );
      var startSymbolExpanded = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbolExpanded.indexOf( "single-expanded.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },

    testIndentSymbolSingleItemOfSecondLayer : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var parent = this._createItem( tree );
      var item = this._createItem( parent );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      var startSymbol = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( startSymbol.indexOf( "end.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },
    
    testRenderIndentSymbolsCustomVariant : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.addState( "variant_testVariant" );
      var row = this._createRow( tree );
      this._addToDom( row );
      testUtil.fakeAppearance( "tree-row-indent",  {
        style : function( states ) {
          var result = null;
          if( states[ "variant_testVariant" ] ) {
            result = "test.gif";
          } else {
            result = "false.gif";
          }
          return { "backgroundImage" : result };
        }
      } );      
      var parent = this._createItem( tree, false, true );
      var item = this._createItem( parent, false, false );
      row.renderItem( item, tree._config, false, null );
      var nodes = row._getTargetNode().childNodes;
      var indentSymbol1 = testUtil.getCssBackgroundImage( nodes[ 1 ] );
      assertTrue( indentSymbol1.indexOf( "test.gif" ) != -1 );
      var indentSymbol2 = testUtil.getCssBackgroundImage( nodes[ 0 ] );
      assertTrue( indentSymbol2.indexOf( "test.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },
    
    testRenderItemFont : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setFont( "12px monospace" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      var font = testUtil.getElementFont( node );
      assertTrue( font.indexOf( "monospace" ) != -1 );
      assertTrue( font.indexOf( "12px" ) != -1 );
      assertEquals( node.style.height, node.style.lineHeight );
      tree.destroy();
      row.destroy();
    },
    
    testRenderCellFont : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setItemMetrics( 2, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 3 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setFont( "7px Curier New" );
      item.setTexts( [ "Test1", "Test2", "Test3" ] );
      item.setCellFonts( [ "12px Arial", "14px monospace", "" ] );
      row.renderItem( item, tree._config, false, null );
      var node1 = row._getTargetNode().childNodes[ 1 ];
      var font1 = testUtil.getElementFont( node1 );
      assertTrue( font1.indexOf( "Arial" ) != -1 );
      assertTrue( font1.indexOf( "12px" ) != -1 );
      var node2 = row._getTargetNode().childNodes[ 2 ];
      var font2 = testUtil.getElementFont( node2 );
      assertTrue( font2.indexOf( "monospace" ) != -1 );
      assertTrue( font2.indexOf( "14px" ) != -1 );
      var node3 = row._getTargetNode().childNodes[ 3 ];
      var font3 = testUtil.getElementFont( node3 );
      assertTrue( font3.indexOf( "Curier" ) != -1 );
      assertTrue( font3.indexOf( "7px" ) != -1 );
      tree.destroy();
      row.destroy();
    }, 

    testRenderItemForeground : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setForeground( "red" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      assertEquals( "red", node.style.color );
      tree.destroy();
      row.destroy();
    },

    testRenderItemForegroundDisabled : function() {
      var tree = this._createTree();
      tree.setEnabled( false );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setForeground( "red" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      assertEquals( "black", node.style.color );
      tree.destroy();
      row.destroy();
    },

    testResetForeground : function( ) {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setForeground( "red" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      assertEquals( "red", node.style.color );
      item.setForeground( null );
      row.renderItem( item, tree._config, false, null );
      assertEquals( "black", node.style.color );
      tree.destroy();
      row.destroy();
    },

    testRenderCellForeground : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1", "Test2" ] );
      item.setCellForegrounds( [ "red", "green" ] );
      row.renderItem( item, tree._config, false, null );
      var node1 = row._getTargetNode().childNodes[ 1 ];
      assertEquals( "red", node1.style.color );
      var node2 = row._getTargetNode().childNodes[ 2 ];
      assertEquals( "green", node2.style.color );
      tree.destroy();
      row.destroy();
    }, 
    
    testRenderItemBackground : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setBackground( "red" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode();
      assertEquals( "red", node.style.backgroundColor );
      tree.destroy();
      row.destroy();
    },
    
    testRenderItemBackgroundDisabled : function() {
      var tree = this._createTree();
      tree.setEnabled( false );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setBackground( "red" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode();
      assertEquals( "", node.style.backgroundColor );
      tree.destroy();
      row.destroy();
    },

    testRenderCellBackground : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test", "Test2" ] );
      item.setCellBackgrounds( [ "red", "green" ] );
      row.renderItem( item, tree._config, false, null );
      var children = row._getTargetNode().childNodes;
      assertEquals( 5, children.length );
      assertEquals( "red", children[ 1 ].style.backgroundColor );
      assertEquals( 1, parseInt( children[ 1 ].style.zIndex ) );
      assertEquals( "Test", children[ 2 ].innerHTML );
      assertEquals( "green", children[ 3 ].style.backgroundColor );
      assertEquals( "Test2", children[ 4 ].innerHTML );
      tree.destroy();
      row.destroy();
    },

    testRenderCellBackgroundDisabled : function() {
      var tree = this._createTree();
      tree.setEnabled( false );
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test", "Test2" ] );
      item.setCellBackgrounds( [ "red", "green" ] );
      row.renderItem( item, tree._config, false, null );
      var children = row._getTargetNode().childNodes;
      assertEquals( 3, children.length );
      assertEquals( "Test", children[ 1 ].innerHTML );
      assertEquals( "Test2", children[ 2 ].innerHTML );
      tree.destroy();
      row.destroy();
    },

    testRenderCellBackgroundBounds : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      row.setHeight( 15 );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setCellBackgrounds( [ "red" ] ); 
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      assertEquals( "red", node.style.backgroundColor );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var bounds = testUtil.getElementBounds( node );
      assertEquals( 4, bounds.left );
      assertEquals( 15, bounds.height );
      assertEquals( 66, bounds.width );
      assertEquals( 0, bounds.top );
      tree.destroy();
      row.destroy();
    },

    testRenderCellBackgroundBoundsWithLinesVisible : function() {
      var tree = this._createTree();
      tree.setLinesVisible( true );
      var row = this._createRow( tree );
      row.setHeight( 15 );
      row.setState( "linesvisible", true );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setCellBackgrounds( [ "red" ] ); 
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      assertEquals( "red", node.style.backgroundColor );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var bounds = testUtil.getElementBounds( node );
      assertEquals( 4, bounds.left );
      assertEquals( 14, bounds.height );
      assertEquals( 66, bounds.width );
      assertEquals( 0, bounds.top );
      tree.destroy();
      row.destroy();
    },

    testRenderImagesOnly : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setItemMetrics( 2, 50, 40, 50, 12, 65, 12 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      tree.setColumnCount( 3 );
      
      item.setTexts( [ "", "", "" ] );
      item.setImages( [ "test1.jpg", null, "test3.jpg" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      assertEquals( 3, nodes.length );
      assertEquals( 3, parseInt( nodes[ 1 ].style.zIndex ) );
      var position = nodes[ 1 ].style.backgroundPosition;
      assertTrue(    position.indexOf( "center" ) != -1 
                  || position.indexOf( "50%" ) != -1 );
      var url1 = testUtil.getCssBackgroundImage( nodes[ 1 ] );
      assertTrue( url1.indexOf( "test1.jpg" ) != -1 );
      var url2 = testUtil.getCssBackgroundImage( nodes[ 2 ] );
      assertTrue( url2.indexOf( "test3.jpg" ) != -1 );      
      tree.destroy();
      row.destroy();
    },

    testRenderImagesDisabled : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setItemMetrics( 2, 50, 40, 50, 12, 65, 12 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      tree.setColumnCount( 3 );
      item.setTexts( [ "", "", "" ] );
      item.setImages( [ "test1.jpg", null, "test3.jpg" ] );
      row.renderItem( item, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      assertFalse( testUtil.hasElementOpacity( nodes[ 1 ] ) );
      tree.setEnabled( false );
      row.renderItem( item, tree._config, false, null );      
      assertTrue( testUtil.hasElementOpacity( nodes[ 1 ] ) );
      tree.destroy();
      row.destroy();
    },

    testImageBounds : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      row.setHeight( 15 );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "" ] );
      item.setImages( [ "bla.jpg" ] );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode();
      assertEquals( 2, node.childNodes.length );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var style = node.childNodes[ 1 ].style;
      assertEquals( 0, parseInt( style.top ) );
      assertEquals( 40, parseInt( style.left ) );
      assertEquals( 15, parseInt( style.height ) );
      assertEquals( 10, parseInt( style.width ) );
      tree.destroy();
      row.destroy();
    },
    
    testRenderImageAndLabelAndBackground : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      item.setImages( [ "bla.jpg" ] );
      item.setCellBackgrounds( [ "green" ] );
      row.renderItem( item, tree._config, false, null );
      var nodes = row._getTargetNode().childNodes;
      assertEquals( 4, nodes.length );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var background = nodes[ 1 ].style.backgroundColor;
      var image = testUtil.getCssBackgroundImage( nodes[ 2 ] );
      var text = nodes[ 3 ].innerHTML;
      assertEquals( "green", background );
      assertTrue( image.indexOf( "bla.jpg" ) != -1 );
      assertEquals( "Test", text );
      tree.destroy();
      row.destroy();
    },

    testReUseBackgoundElement : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item1 = this._createItem( tree );
      item1.setTexts( [ "" ] );
      item1.setCellBackgrounds( [ "green" ] );
      var item2 = this._createItem( tree );
      item2.setTexts( [ "Test" ] );
      var nodes = row._getTargetNode().childNodes;
      row.renderItem( item1, tree._config, false, null );
      assertEquals( "green", nodes[ 1 ].style.backgroundColor );
      row.renderItem( item2, tree._config, false, null );
      assertEquals( "", nodes[ 1 ].style.backgroundColor );
      tree.destroy();
      row.destroy();
    },

    testReUseImage : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item1 = this._createItem( tree );
      item1.setTexts( [ "" ] );
      item1.setImages( [ "bla.jpg" ] );
      var item2 = this._createItem( tree );
      item2.setTexts( [ "Test" ] );
      row.renderItem( item1, tree._config, false, null );
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var nodes = row._getTargetNode().childNodes;
      var image = testUtil.getCssBackgroundImage( nodes[ 1 ] );
      assertTrue( image.indexOf( "bla.jpg" ) != -1 );
      row.renderItem( item2, tree._config, false, null );
      assertEquals( "", testUtil.getCssBackgroundImage( nodes[ 1 ] ) );
      tree.destroy();
      row.destroy();
    },

    testReUseLabel : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item1 = this._createItem( tree );
      item1.setTexts( [ "Test" ] );
      var item2 = this._createItem( tree );
      item2.setTexts( [ "" ] );
      item2.setCellBackgrounds( [ "red" ] );
      row.renderItem( item1, tree._config, false, null );
      var nodes = row._getTargetNode().childNodes;
      assertEquals( "Test", nodes[ 1 ].innerHTML );
      row.renderItem( item2, tree._config, false, null );
      assertEquals( "", nodes[ 1 ].innerHTML );
      tree.destroy();
      row.destroy();
    },
    
    testMultipleCellsPosition : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 0, 0, 40, 0, 12, 14, 12 );
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 ); 
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test", "Test2" ] );
      item.setImages( [ "bla.jpg", "bla2.jpg" ] );
      item.setCellBackgrounds( [ "green", "blue" ] );
      row.renderItem( item, tree._config, false, null );
      var nodes = row._getTargetNode().childNodes;
      assertEquals( 7, nodes.length );
      assertEquals( 0, parseInt( nodes[ 1 ].style.left ) );
      assertEquals( 16, parseInt( nodes[ 2 ].style.left ) );
      assertEquals( 30, parseInt( nodes[ 3 ].style.left ) );
      assertEquals( 50, parseInt( nodes[ 4 ].style.left ) );
      assertEquals( 50, parseInt( nodes[ 5 ].style.left ) );
      assertEquals( 65, parseInt( nodes[ 6 ].style.left ) );
      tree.destroy();
      row.destroy();
    },

    testMultipleLayersMultipleCellsPosition : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 0, 0, 50, 0, 12, 14, 12 );
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 ); 
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var parent1 = this._createItem( tree );
      var parent2 = this._createItem( parent1 );
      var item = this._createItem( parent2 );
      item.setTexts( [ "Test", "Test2" ] );
      item.setImages( [ "bla.jpg", "bla2.jpg" ] );
      item.setCellBackgrounds( [ "green", "blue" ] );
      row.renderItem( item, tree._config, false, null );
      var nodes = row._getTargetNode().childNodes;
      assertEquals( 0, parseInt( nodes[ 1 ].style.left ) );
      assertEquals( 48, parseInt( nodes[ 2 ].style.left ) );
      assertEquals( 62, parseInt( nodes[ 3 ].style.left ) );
      assertEquals( 50, parseInt( nodes[ 4 ].style.left ) );
      assertEquals( 50, parseInt( nodes[ 5 ].style.left ) );
      assertEquals( 65, parseInt( nodes[ 6 ].style.left ) );
      tree.destroy();
      row.destroy();
    },

    testMoreDataThanColumns : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 70, 40, 70, 20, 90, 20 );  
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      tree.setColumnCount( 2 );
      item.setTexts( [ "Test1", "Test2", "Test3", "Test4" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 3, row._getTargetNode().childNodes.length );
      tree.destroy();
      row.destroy();      
    },

    testMoreColumnsThanData : function() {
      var tree = this._createTree();
      tree.setItemMetrics( 1, 70, 40, 70, 20, 90, 20 );
      tree.setItemMetrics( 2, 70, 40, 70, 20, 90, 20 );
      tree.setItemMetrics( 3, 70, 40, 70, 20, 90, 20 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      tree.setColumnCount( 4 );
      item.setTexts( [ "Test1", "Test2" ] );
      item.setImages( [ "bla1.jpg" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 4, row._getTargetNode().childNodes.length );
      tree.destroy();
      row.destroy();
    },
    
    testRenderNoIndentSymbols : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      testUtil.fakeAppearance( "tree-row-indent", {} );
      var row = this._createRow( tree );
      this._addToDom( row );
      var parent1 = this._createItem( tree, false, true );
      var parent2 = this._createItem( parent1, false, false );
      var parent3 = this._createItem( parent2, false, true );
      var item = this._createItem( parent3, true, false );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( 1, row._getTargetNode().childNodes.length );
      tree.destroy();
      row.destroy();
    },
    
    testIsExpandClick : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      var row = this._createRow( tree );
      var log = [];
      this._addToDom( row );
      var item = this._createItem( tree, false, false );
      this._createItem( item, false, false );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      row.addEventListener( "mousedown", function( event ) {
        log.push( row.isExpandSymbolTarget( event ) );
      } );
      testUtil.clickDOM( row._getTargetNode().childNodes[ 0 ] );
      testUtil.clickDOM( row._getTargetNode().childNodes[ 1 ] );
      assertEquals( 2, log.length );
      assertTrue(  log[ 0 ] );
      assertFalse( log[ 1 ] );
      tree.destroy();
      row.destroy();
    },

    testDestroy : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, "check" );
      var row = this._createRow( tree );
      var item = this._createItem( tree, false, false );
      item.setTexts( [ "Test" ] );
      this._addToDom( row );
      row.renderItem( item, tree._config, false, null );
      assertNotNull( row._expandImage );
      var element = row.getElement();
      assertTrue( element.parentNode === document.body );
      row.destroy();
      testUtil.flush();
      assertTrue( row.isDisposed() );
      assertNull( row.getElement() );
      assertTrue( element.parentNode !== document.body );
      assertNull( row._textNodes );
      assertNull( row._expandElement );      
      assertNull( row._checkBoxElement );      
      assertNull( row._selectionElements );      
      tree.destroy();
      row.destroy();
    },

    testRenderCheckBox : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, "check" );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      this._setCheckBox( "mycheckbox.gif" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      var url = testUtil.getCssBackgroundImage( node );
      assertTrue( url.indexOf( "mycheckbox.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },

    testRenderCheckBoxForTable : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( true, "check" );
      var row = this._createRow( tree, true );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      this._setCheckBox( "mycheckboxtable.gif", true );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 0 ];
      var url = testUtil.getCssBackgroundImage( node );
      assertTrue( url.indexOf( "mycheckboxtable.gif" ) != -1 );
      tree.destroy();
      row.destroy();
    },

    testRenderCheckBoxBounds : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, "check" );
     var row = this._createRow( tree );
      row.setHeight( 15 );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      this._setCheckBox( "mycheckbox.gif" );
      row.renderItem( item, tree._config, false, null );
      var style = row._getTargetNode().childNodes[ 1 ].style;
      assertEquals( 0, parseInt( style.top ) );
      assertEquals( 15, parseInt( style.height ) );
      assertEquals( 21, parseInt( style.left ) );
      assertEquals( 20, parseInt( style.width ) );
      tree.destroy();
      row.destroy();
    },
    
    testIsCheckBoxClick : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, "check" );
      var row = this._createRow( tree );
      this._setCheckBox( "mycheckbox.gif" );
      var log = [];
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test" ] );
      row.renderItem( item, tree._config, false, null );
      row.addEventListener( "mousedown", function( event ) {
        log.push( row.isCheckBoxTarget( event ) );
      } );
      testUtil.clickDOM( row._getTargetNode().childNodes[ 0 ] );
      testUtil.clickDOM( row._getTargetNode().childNodes[ 1 ] );
      testUtil.clickDOM( row._getTargetNode().childNodes[ 2 ] );
      assertEquals( [ false, true, false ], log );
      tree.destroy();
      row.destroy();
    },
    
    testRenderState : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, false, "fullSelection" );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      tree.blur();
      row.renderItem( item, tree._config, false, null );
      assertFalse( row.hasState( "over" ) );
      assertFalse( row.hasState( "checked" ) );
      assertFalse( row.hasState( "selected" ) );
      assertFalse( row.hasState( "grayed" ) );
      assertTrue( row.hasState( "parent_unfocused" ) );
      item.setChecked( true );
      item.setGrayed( true );
      item.setVariant( "testVariant" );
      tree.focus();
      testUtil.flush();
      row.renderItem( item, tree._config, true, row.getElement() );
      assertTrue( typeof row._isInGlobalStateQueue == "undefined" );
      assertTrue( row.hasState( "over" ) );
      assertTrue( row.hasState( "checked" ) );
      assertTrue( row.hasState( "selected" ) );
      assertTrue( row.hasState( "grayed" ) );
      assertFalse( row.hasState( "parent_unfocused" ) );
      assertTrue( row.hasState( "testVariant" ) );
      tree.destroy();
      row.destroy();
    },

    testRenderStateWidthDNDSelected : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree(  false, false, "fullSelection" );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      tree.blur();
      row.renderItem( item, tree._config, false, null );
      assertFalse( row.hasState( "selected" ) );
      assertTrue( row.hasState( "parent_unfocused" ) );
      row.setState( "dnd_selected", true );
      testUtil.flush();
      row.renderItem( item, tree._config, false, null );
      assertTrue( row.hasState( "dnd_selected" ) );
      assertTrue( row.hasState( "selected" ) );
      assertFalse( row.hasState( "parent_unfocused" ) );
      tree.destroy();
      row.destroy();
    },
    
    testRenderSelectionStateWithHideSelection : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( true, "fullSelection", "hideSelection" );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      tree.blur();
      row.renderItem( item, tree._config, true, null );
      assertTrue( row.hasState( "parent_unfocused" ) );
      assertFalse( row.hasState( "selected" ) );
      tree.destroy();
      row.destroy();
    },
    
    testRenderSelectionStateWithAlwaysHideSelection : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( true, "fullSelection" );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      tree.setAlwaysHideSelection( true );
      row.renderItem( item, tree._config, true, null );
      assertFalse( row.hasState( "selected" ) );
      tree.destroy();
      row.destroy();
    },
    
    testRenderThemingItemBackground : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1" ] );
      row.renderItem( item, tree._config, false, null );
      assertNull( row.getBackgroundColor() );
      this._setItemBackground( "green" );
      row.renderItem( item, tree._config, false, null );      
      assertEquals( "green", row.getBackgroundColor() );
      assertEquals( 2, row._getTargetNode().childNodes.length );
      tree.destroy();
      row.destroy();
    },
    
    testRenderItemBackgroundSelected : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "T1", "T2" ] );
      this._setItemBackground( "green" );
      row.renderItem( item, tree._config, true, null );
      assertEquals( "green", row.getBackgroundColor() );
      assertEquals( 4, row._getTargetNode().childNodes.length );
      var selNode = row._getTargetNode().childNodes[ 2 ];
      assertEquals( "", selNode.innerHTML );
      var width = parseInt( selNode.style.width );
      assertEquals( "green", selNode.style.backgroundColor );
      assertEquals( 2, parseInt( selNode.style.zIndex ) );            
      assertEquals( 18, parseInt( selNode.style.left ) );            
      // Since we dont know the scrollwidth of the node, this is a bit fuzzy:
      assertTrue( width > 10 && width < 45 );
      tree.destroy();
      row.destroy();
    },
    
    testRenderItemBackgroundSelectedColumnToSmall : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Teeeeeeeeeeeeessssst1", "T2" ] );
      this._setItemBackground( "green" );
      row.renderItem( item, tree._config, true, null );
      assertEquals( "green", row.getBackgroundColor() );
      assertEquals( 4, row._getTargetNode().childNodes.length );
      var selNode = row._getTargetNode().childNodes[ 2 ];
      assertEquals( "", selNode.innerHTML );
      var width = parseInt( selNode.style.width );
      assertEquals( "green", selNode.style.backgroundColor );
      assertEquals( 2, parseInt( selNode.style.zIndex ) );            
      assertEquals( 18, parseInt( selNode.style.left ) );            
      // Since we dont know the scrollwidth of the node, this is a bit fuzzy:
      assertEquals( 48, width );
      tree.destroy();
      row.destroy();
    },
    
    testRenderItemBackgroundSelectedBeforeInDOM : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      row._isInGlobalDisplayQueue = true; // prevent add to display queue
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "T1", "T2" ] );
      this._setItemBackground( "green" );
      row.renderItem( item, tree._config, true, null );
      assertEquals( "green", row.getBackgroundColor() );
      assertEquals( 4, row._getTargetNode().childNodes.length );
      var selNode = row._getTargetNode().childNodes[ 2 ];
      var width = parseInt( selNode.style.width );
      assertEquals( "green", selNode.style.backgroundColor );
      // Since we dont know the scrollwidth of the node, this is a bit fuzzy:
      assertTrue( width > 10 && width < 45 );
      tree.destroy();
      row.destroy();
    },

    testSelectionBackgroundTheming : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, false, "fullSelection" );
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {};
          if( states.selected ) {
            result.itemBackground = "blue";
          } else {
            result.itemBackground = "#888888";
          }
          return result;
        }
      } );  
      var row = this._createRow( tree );
      this._addToDom( row );
      row.setAppearance( "tree-row" );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1" ] );
      row.renderItem( item, tree._config, false, null );
      assertEquals( "#888888", row.getBackgroundColor() );
      row.renderItem( item, tree._config, true, null );
      assertEquals( "blue", row.getBackgroundColor() );
      row.renderItem( item, tree._config, false, null );
      tree.destroy();
      row.destroy();
    },  

    testFullSelectionOverwritesTheming : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, false, "fullSelection" );
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {};
          if( states.selected ) {
            result.itemBackground = "blue";
            result.itemForeground = "white";
          } else {
            result.itemBackground = "#888888";
            result.itemForeground = "black"
          }
          return result;
        }
      } );  
      var row = this._createRow( tree );
      this._addToDom( row );
      row.setAppearance( "tree-row" );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1" ] );
      item.setCellBackgrounds( [ "red" ] );
      item.setCellForegrounds( [ "yellow" ] );
      row.renderItem( item, tree._config, false, null );
      var children = row._getTargetNode().childNodes;
      assertEquals( "#888888", row.getBackgroundColor() );
      assertEquals( "red", children[ 1 ].style.backgroundColor );
      assertEquals( "yellow", children[ 2 ].style.color );
      row.renderItem( item, tree._config, true, null );
      assertEquals( "blue", row.getBackgroundColor() );
      assertEquals( "", children[ 1 ].style.backgroundColor );
      assertEquals( "white", children[ 1 ].style.color );
      row.renderItem( item, tree._config, false, null );
      tree.destroy();
      row.destroy();
    },  

   testHoverColorsOverwritesTheming : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, false, "fullSelection" );
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {};
          if( states.over ) {
            result.itemBackground = "blue";
            result.itemForeground = "white";
          } else {
            result.itemBackground = "#888888";
            result.itemForeground = "black"
          }
          return result;
        }
      } );
      var row = this._createRow( tree );
      this._addToDom( row );
      row.setAppearance( "tree-row" );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1" ] );
      item.setCellBackgrounds( [ "red" ] );
      item.setBackground( "black" );
      item.setCellForegrounds( [ "yellow" ] );
      row.renderItem( item, tree._config, false, null );
      var children = row._getTargetNode().childNodes;
      assertEquals( "black", row.getBackgroundColor() );
      assertEquals( "red", children[ 1 ].style.backgroundColor );
      assertEquals( "yellow", children[ 2 ].style.color );
      row.renderItem( item, tree._config, row.getElement() );
      assertEquals( "blue", row.getBackgroundColor() );
      assertEquals( "", children[ 1 ].style.backgroundColor );
      assertEquals( "white", children[ 1 ].style.color );
      row.renderItem( item, tree._config, false, null );
      tree.destroy();
      row.destroy();
    },  

   testHoverWithoutColorDoesNotOverwriteTheming : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, false, "fullSelection" );
      var row = this._createRow( tree );
      this._addToDom( row );
      row.setAppearance( "tree-row" );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1" ] );
      item.setCellBackgrounds( [ "red" ] );
      item.setBackground( "black" );
      item.setCellForegrounds( [ "yellow" ] );
      row.renderItem( item, tree._config, false, null );
      var children = row._getTargetNode().childNodes;
      assertEquals( "black", row.getBackgroundColor() );
      assertEquals( "red", children[ 1 ].style.backgroundColor );
      assertEquals( "yellow", children[ 2 ].style.color );
      row.renderItem( item, tree._config, false, row.getElement() );
      assertEquals( "black", row.getBackgroundColor() );
      assertEquals( "red", children[ 1 ].style.backgroundColor );
      assertEquals( "yellow", children[ 2 ].style.color );
      row.renderItem( item, tree._config, false, null );
      tree.destroy();
      row.destroy();
    },  


    testRenderThemingItemForeground : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1" ] );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      row.renderItem( item, tree._config, false, null );      
      assertEquals( "black", node.style.color );
      this._setItemForeground( "red" );
      row.renderItem( item, tree._config, false, null );      
      assertEquals( "red", node.style.color );
      tree.destroy();
      row.destroy();
    },

    testSelectionForegroundTheming : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {
            "itemBackground" : null,
            "checkBox" : null
          };
          if( states.selected ) {
            result.itemForeground = "white";
          } else {
            result.itemForeground = "black";
          }
          return result;
        }
      } );  
      var row = this._createRow( tree );
      this._addToDom( row );
      row.setAppearance( "tree-row" );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1", "Test2" ] );
      row.renderItem( item, tree._config, false, null );
      nodes = row._getTargetNode().childNodes;
      assertEquals( 3, nodes.length );
      assertEquals( "black", nodes[ 1 ].style.color );
      assertEquals( "black", nodes[ 2 ].style.color );      
      row.renderItem( item, tree._config, true, null );
      assertEquals( "white", nodes[ 1 ].style.color );
      assertEquals( "black", nodes[ 2 ].style.color );      
      tree.destroy();
      row.destroy();
    },  
    
    testSelectionForegroundThemingFullSelection : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, false, "fullSelection" );
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {
            "itemBackground" : null,
            "checkBox" : null
          };
          if( states.selected ) {
            result.itemForeground = "white";
          } else {
            result.itemForeground = "black";
          }
          return result;
        }
      } );  
      var row = this._createRow( tree );
      this._addToDom( row );
      row.setAppearance( "tree-row" );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1", "Test2" ] );
      row.renderItem( item, tree._config, false, null );
      var nodes = row._getTargetNode().childNodes;
      assertEquals( 3, nodes.length );
      assertEquals( "black", nodes[ 1 ].style.color );
      assertEquals( "black", nodes[ 2 ].style.color );      
      row.renderItem( item, tree._config, true, null );
      assertEquals( "white", nodes[ 1 ].style.color );
      assertEquals( "white", nodes[ 2 ].style.color );      
      tree.destroy();
      row.destroy();
    },  
    
    testIsSelectionClick : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, "check" );
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var parent = this._createItem( tree, false, true );
      var item = this._createItem( parent );
      item.setTexts( [ "Test", "Test2" ] );
      item.setImages( [ "bla.jpg" ] );
      this._setCheckBox( "mycheckbox.gif" );
      row.renderItem( item, tree._config, false, null );
      var log = [];
      row.addEventListener( "mousedown", function( event ) {
        log.push( row.isSelectionClick( event, false ) );
      } );
      var nodes = row._getTargetNode().childNodes;
      testUtil.clickDOM( nodes[ 0 ] ); // expandimage
      testUtil.clickDOM( nodes[ 1 ] ); // treeline
      testUtil.clickDOM( nodes[ 2 ] ); // checkbox
      testUtil.clickDOM( nodes[ 3 ] ); // image
      testUtil.clickDOM( nodes[ 4 ] ); // label
      testUtil.clickDOM( nodes[ 5 ] ); // label
      testUtil.clickDOM( row._getTargetNode() );
      assertEquals( [ false, false, false, true, true, false, false  ], log );
      tree.destroy();
      row.destroy();
    },
    
    testIsSelectionClickFullSelection : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree( false, "check", "fullSelection" );
      tree.setItemMetrics( 1, 50, 40, 50, 12, 65, 12 );
      tree.setColumnCount( 2 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var parent = this._createItem( tree, false, true  );
      var item = this._createItem( parent );
      item.setTexts( [ "Test", "Test2" ] );
      item.setImages( [ "bla.jpg" ] );
      this._setCheckBox( "mycheckbox.gif" );
      row.renderItem( item, tree._config, false, null );
      var log = [];
      row.addEventListener( "mousedown", function( event ) {
        log.push( row.isSelectionClick( event, true ) );
      } );
      var nodes = row._getTargetNode().childNodes;
      testUtil.clickDOM( nodes[ 0 ] ); // expandimage
      testUtil.clickDOM( nodes[ 1 ] ); // treeline
      testUtil.clickDOM( nodes[ 2 ] ); // checkbox
      testUtil.clickDOM( nodes[ 3 ] ); // image
      testUtil.clickDOM( nodes[ 4 ] ); // label
      testUtil.clickDOM( nodes[ 5 ] ); // label
      testUtil.clickDOM( row._getTargetNode() );
      assertEquals( [ true, true, false, true, true, true, true ], log );
      tree.destroy();
      row.destroy();
    },

    testInheritItemForeground : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.setTextColor( "red" );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1" ] );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];      
      assertEquals( "red", node.style.color );
      tree.destroy();
      row.destroy();
    },

    testInheritFont : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      tree.setFont( new qx.ui.core.Font( 12, [ "monospace" ] ) );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test1" ] );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      var font = testUtil.getElementFont( node );
      assertTrue( font.indexOf( "monospace" ) != -1 );
      assertTrue( font.indexOf( "12px" ) != -1 );
      tree.destroy();
      row.destroy();
    },

    testRenderNoItemNoThemingBackground: function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._setItemBackground( "blue" );      
      this._addToDom( row );
      row.renderItem( null );
      assertNull( row.getBackgroundColor() );
      tree.destroy();
      row.destroy();      
    },

    testRenderLabelAlignmentTreeColumn : function() {
      var tree = this._createTree();
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test", "Test" ] );
      tree.setAlignment( 0, "center" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 1 ];
      assertEquals( "left", node.style.textAlign );
      tree.setAlignment( 0, "right" );
      row.renderItem( item, tree._config, false, null );
      assertEquals( "left", node.style.textAlign );
      tree.destroy();
      row.destroy();
    },

    testRenderLabelAlignment : function() {
      var tree = this._createTree()
      tree.setTreeColumn( 1 );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = this._createItem( tree );
      item.setTexts( [ "Test", "Test" ] );
      tree.setAlignment( 0, "center" );
      row.renderItem( item, tree._config, false, null );
      var node = row._getTargetNode().childNodes[ 0 ];
      assertEquals( "center", node.style.textAlign );
      tree.setAlignment( 0, "right" );
      row.renderItem( item, tree._config, false, null );
      assertEquals( "right", node.style.textAlign );
      tree.destroy();
      row.destroy();
    },
    
    testSelectionBackgroundLayout : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {};
          if( states.selected ) {
            result.itemBackground = "blue";
          } else {
            result.itemBackground = "#888888";
          }
          return result;
        }
      } );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = new org.eclipse.rwt.widgets.TreeItem( tree.getRootItem() );
      item.setTexts( [ "Test1" ] );
      var selectionPadding = 4;
      tree.setItemMetrics( 0, 0, 100, 0, 0 ,0, 100 );       
      row.renderItem( item, tree._config, true, null );
      var rowNode = row._getTargetNode();
      var color = rowNode.childNodes[ 2 ].style.backgroundColor;
      assertEquals( "blue", color );
      var textWidth = row._getVisualTextWidth( item, 0, tree._config );
      //parseInt( rowNode.childNodes[ 1 ].style.width );
      var selectionWidth = parseInt( rowNode.childNodes[ 2 ].style.width );
      assertEquals( textWidth + selectionPadding, selectionWidth );
      tree.destroy();
      row.destroy();
    },
    
    testSelectionBackgroundLayoutCutOff : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {};
          if( states.selected ) {
            result.itemBackground = "blue";
          } else {
            result.itemBackground = "#888888";
          }
          return result;
        }
      } );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = new org.eclipse.rwt.widgets.TreeItem( tree.getRootItem() );
      item.setTexts( [ "Test1" ] );
      var selectionPadding = 3; // only the left side
      tree.setItemMetrics( 0, 0, 100, 0, 0 ,0, 25 );       
      row.renderItem( item, tree._config, true, null );
      var rowNode = row._getTargetNode();
      var textWidth = parseInt( rowNode.childNodes[ 1 ].style.width );
      var selectionWidth = parseInt( rowNode.childNodes[ 2 ].style.width );
      assertEquals( textWidth + selectionPadding, selectionWidth );
      tree.destroy();
      row.destroy();
    },
    
    testSelectionBackgroundLayoutInvisible : function() {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var tree = this._createTree();
      testUtil.fakeAppearance( "tree-row", {
        style : function( states ) {
          var result = {};
          if( states.selected ) {
            result.itemBackground = "blue";
          } else {
            result.itemBackground = "#888888";
          }
          return result;
        }
      } );
      var row = this._createRow( tree );
      this._addToDom( row );
      var item = new org.eclipse.rwt.widgets.TreeItem( tree.getRootItem() );
      item.setTexts( [ "Test1" ] );
      tree.setItemMetrics( 0, 0, 100, 0, 0 ,0, 0 );       
      row.renderItem( item, tree._config, true, null );
      var rowNode = row._getTargetNode();
      var selectionWidth = parseInt( rowNode.childNodes[ 2 ].style.width );
      assertEquals( 0, selectionWidth );
      tree.destroy();
      row.destroy();
    },

     /////////
     // Helper
     
     _createRow : function( tree, isTable ) {
       var result = new org.eclipse.rwt.widgets.TreeRow( tree );
       if( isTable ) {
	       result.setAppearance( "table-row" );         
       } else {
	       result.setAppearance( "tree-row" );
       }
       return result;
     },

    _addToDom : function( widget ) {
      widget.addToDocument();
      org.eclipse.rwt.test.fixture.TestUtil.flush();
    },
    
    _createTree : function( isTable, option, option2 ) {
      var base = isTable ? "table" : "tree";
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      testUtil.fakeAppearance( base + "-row",  {
        style : function( states ) {
          return {
            "itemBackground" : "undefined",
            "itemForeground" : "undefined",
            "checkBox" : null
          }
        }
      } );      
      testUtil.fakeAppearance( "tree-row-indent",  {
        style : function( states ) {
          var result = null;
          if( states.line ) {
            result = "line.gif";
          } else { 
            if( states.first && states.last ) {
              result = "single";
            } else if( states.first ) {
              result = "start";
            } else if( states.last ) {
              result = "end";
            } else {
              result = "intermediate";
            }
            if( states.expanded ) {
              result += "-expanded";
            } else if( states.collapsed ) {
              result += "-collapsed";                
            }
          }
          result += ".gif";
          return { "backgroundImage" : result };
        }
      } );
      var args = { "appearance" : base };
      args[ "selectionPadding" ] = [ 3, 1 ];
      args[ "indentionWidth" ] = 16;
      args[ option ] = true;
      if( option === "check" ) {
        args[ "checkBoxMetrics" ] = [ 5, 20 ];
      }
      if( option2 ) {
        args[ option2 ] = true;      
      }
      var result = new org.eclipse.rwt.widgets.Tree( args );
      result.setTextColor( "black" );
      result.setItemMetrics( 0, 4, 66, 24, 10, 5, 45 );
      result.setItemHeight( 15 );
      result.setColumnCount( 1 );
      if( isTable ) {
        result.setTreeColumn( -1 );
      }
      return result;
    },

    _createItem : function( parent, hasPrevious, hasNext ) {
      var parentItem = org.eclipse.rwt.widgets.TreeItem._getItem( parent );
      var count = 0;
      parent.setItemCount( 1 + hasPrevious ? 1 : 0 + hasNext ? 1 : 0 );
      if( hasPrevious ) {
        new org.eclipse.rwt.widgets.TreeItem( parentItem, count );
        count++;
      }
      var item = new org.eclipse.rwt.widgets.TreeItem( parentItem, count );
      count++;
      if( hasNext ) {
        new org.eclipse.rwt.widgets.TreeItem( parentItem, count );
      }
      return item;
    },
    
    _setCheckBox : function( value, isTable ) {
      var appearance = "tree-row-check-box";
      if( isTable ) {
        appearance = "table-row-check-box";
      }
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      testUtil.fakeAppearance( appearance,  {
        style : function( states ) {
          return {
            "backgroundImage" : states.over ? "over.gif" : value
          }
        }
      } );
    },
     
    _setItemBackground : function( value ) {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      testUtil.fakeAppearance( "tree-row",  {
        style : function( states ) {
          return {
            "itemBackground" : value,
            "itemForeground" : "undefined",
            "checkBox" : null
          }
        }
      } );
    },
     
    _setItemForeground : function( value ) {
      var testUtil = org.eclipse.rwt.test.fixture.TestUtil;
      testUtil.fakeAppearance( "tree-row",  {
        style : function( states ) {
          return {
            "itemBackground" : "undefined",
            "itemForeground" : value,
            "checkBox" : null
          }
        }
      } );
    }
     
  }
  
} );