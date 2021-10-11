# This file is part of scrilla: https://github.com/chinchalinchin/scrilla.

# scrilla is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License version 3
# as published by the Free Software Foundation.

# scrilla is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with scrilla.  If not, see <https://www.gnu.org/licenses/>
# or <https://github.com/chinchalinchin/scrilla/blob/develop/main/LICENSE>.

from typing import Callable, Dict
from PySide6 import QtGui, QtCore, QtWidgets

from scrilla.gui import utilities

# TODO: have widgets create their own layouts and arrange their hcild widgets in them, i.e. not in their root layout.
#       then compose the layouts in the functions module.

# in fact, if you think about it, none of these widgets need to inherit QWidget. they could implement Layouts and add their
# child widgets directly to their layouts. then in the functions module, the layouts could be composed...

# that's probably the way to do this...

# this is definitely not a clean way of doing. all the classes are mixed together. need to enforce separation or streamline
# the inheritance.

# question: where should the calculate buttons come from?
# question: what widgets are absolutely necessary for each widget in here?
# isolate by functionality. no widget dependency.

# REFACTOR.

# I think the calculate button and clear button coming from the symbolwidget is fine, but table/composite/graph/portfolio 
# should not hook up the functions to these buttons.

# no inheritance between widgets. 

"""
A series of classes that all inherit from ``PySide6.QtWidgets.QWidget` and build up in sequence the necessary functionality to grab and validate user input, calculate and display results, etc. These widgets are not directly displayed on the GUI; rather, they are used as building blocks by the `scrilla.gui.functions` module, to create widgets specifically for application functions.

All widgets have a similar structure in that they call a series of methods tailored to their specific class: 
    1. **_init**
        Child widgets are constructed. Layouts are created.
    2. **_arrange**
        Child widgets are arranged. Layouts are applied.
    3. **_stage**
        Child widgets are prepped for display.
"""

class ArgumentWidget(QtWidgets.QWidget):
    """
    Base class for other more complex widgets to inherit. An instance of `scrilla.gui.widgets.ArgumentWidget` embeds its child widgets in its own layout,  which is an instance of``PySide6.QtWidgetQVBoxLayout``. This class provides access to the following widgets:a ``PySide6.QtWidgets.QLabel`` for the title widget, an error message widget, a ``PySide6.QtWidgets.QPushButton`` for the calculate button widget, a ``PySide6.QtWidget.QLineEdit`` for ticker symbol input, and a variety of optional input widgets enabled by boolean flags in the `controls` constructor argument. 
    
    Constructor
    -----------
    1. **calculate_function**: ``str``
    2. **clear_function**: ``str``
    3. **controls:**: ``Dict[bool]``
    4. **widget_title**: ``str``
        *Optional*. Defaults to `Function Input`. Title affixed to the top of the widget.
    5. **button_msg**: ``str``
        *Optional*. Defaults to `Calculate`. Message written on `self.calculate_button`

    Attributes
    ----------
    1. **title**: ``PySide6.QtWidgets.QLabel``
    2. **required_title**: ``PySide6.QtWidgets.QLabel``
    3. **optional_title**: ``PySide6.QtWidgets.QLabel``
    4. **required_pane**: ``PySide6.QtWidgets.QLabel``
    5. **optional_pane**: ``PySide6.QtWidgets.QLabel``
    6. **message**: ``PySide6.QtWidgets.QLabel``
        Label attached to `self.symbol_input`.
    7. **error_message**: ``PySide6.QtWidget.QLabel``
        Message displayed if there is an error thrown during calculation.
    8. **calculate_button**: ``PySide6.QtWidget.QPushButton``
        Empty button for super classes to inherit, primed to fire events on return presses
    9. **clear_button**: ``PySide6.QtWidget.QPushButton``
        Empty button for super classes to inherit, primed to fire events on return presses.
    10. **symbol_input**: ``PySide6.QtWidget.QLineEdit``
        Empty text area for super classes to inherit
    """
    # TODO: calculate and clear should be part of THIS constructor, doesn't make sense to have other widgets hook them up.
    def __init__(self, calculate_function: Callable, clear_function: Callable, controls: Dict[bool],
                    widget_title: str ="Function Input", button_msg: str ="Calculate",):
        super().__init__()
        self.widget_title = widget_title
        self.button_msg = button_msg
        self.controls = controls
        self.calculate_function = calculate_function
        self.clear_function = clear_function

        self._init_arg_widgets()
        self._arrange_arg_widgets()
        self._stage_arg_widgets()
    
    def _init_arg_widgets(self):
        """Creates child widgets"""
        self.title = QtWidgets.QLabel(self.widget_title)
        self.title.setObjectName('subtitle')

        self.required_title = QtWidgets.QLabel("Required Arguments")
        self.required_title.setObjectName('label')

        self.optional_title = QtWidgets.QLabel("Optional Arguments")
        self.optional_title.setObjectName('label')

        self.required_pane = QtWidgets.QWidget()
        self.required_pane.setLayout(QtWidgets.QVBoxLayout())

        self.optional_pane = QtWidgets.QWidget()
        self.optional_pane.setLayout(QtWidgets.QVBoxLayout())

        self.message = QtWidgets.QLabel("Separate symbols with comma")
        self.message.setObjectName('text')

        self.error_message = QtWidgets.QLabel("Error message goes here")
        self.error_message.setObjectName('error')

        self.calculate_button = QtWidgets.QPushButton(self.button_msg)
        self.calculate_button.setObjectName('button')
        
        self.clear_button = QtWidgets.QPushButton("Clear")
        self.clear_button.setObjectName('button')

        self.symbol_input = QtWidgets.QLineEdit()
        self.symbol_input.setObjectName('line-edit')

        self.setLayout(QtWidgets.QHBoxLayout())

        # TODO: init the rest of the argument widgets
    
    def _arrange_arg_widgets(self):
        """Provides rendering hints to child widgets"""
        self.title.setAlignment(QtCore.Qt.AlignTop)
        self.message.setAlignment(QtCore.Qt.AlignBottom)
        self.error_message.setAlignment(QtCore.Qt.AlignHCenter)

        self.required_pane.layout().addWidget(self.required_title)
        self.required_pane.layout().addWidget(self.symbol_input)

        self.optional_pane.layout().addWidget(self.optional_title)
        
        self.layout().addWidget(self.title)
        self.layout().addWidget(self.error_message)
        self.layout().addWidget(self.required_pane)
        self.layout().addWidget(self.optional_pane)

        self.layout().addWidget(self.calculate_button)
        self.layout().addWidget(self.clear_button)

    def _stage_arg_widgets(self):
        """Prepares child widgets for display"""
        self.symbol_input.setMaxLength(100)
        self.error_message.hide()
        self.calculate_button.setAutoDefault(True) # emits 'clicked' when return is pressed
        self.clear_button.setAutoDefault(True)
        self.clear_button.clicked.connect(self.clear_function)
        self.calculate_button.clicked.connect(self.calculate_function)
        self.symbol_input.returnPressed.connect(self.calculate_function)

class TableWidget(QtWidgets.QWidget):
    """
    Base class for other more complex widgets to inherit. An instance of `scrilla.gui.widgets.TableWidget` embeds its child widgets in its own layout, which is an instance of``PySide6.QtWidgetQVBoxLayout``. This class provides access to the following widgets: a ``PySide6.QtWidgets.QLabel`` for the title widget, an error message widget and a ``PySide6.QtWidgets.QTableWidget`` for results display. 

    Parameters
    ----------
    1. **widget_title**: ``str``
        Title of the widget. Passed to the super class `scrilla.gui.widgets.SymbolWidget`.
    2. **button_msg**: ``str``
        Message written on the `self.calculate_button`. Passed to the super class `scrilla.gui.widgets.SymbolWidget`.

    Attributes
    ----------
    1. **title**: ``PySide6.QtWidget.QLabel``
    2.. **table**: ``PySide6.QtWidget.QTableWidget``

    """
    def __init__(self, widget_title: str ="Table Result"):
        super().__init__(widget_title=widget_title)
        self._init_table_widgets(widget_title)
        self._arrange_table_widgets()
        self._stage_table_widgets()

    def _init_table_widgets(self, widget_title):
        """Creates child widgets and their layouts"""
        self.title = QtWidgets.QLabel(widget_title)
        self.title.setObjectName('subtitle')

        self.table = QtWidgets.QTableWidget()
        self.table.setObjectName('table')

        self.setLayout(QtWidgets.QVBoxLayout())
    
    def _arrange_table_widgets(self):
        self.table.setHorizontalHeader(QtWidgets.QHeaderView(QtCore.Qt.Horizontal))
        self.table.horizontalHeader().setStretchLastSection(True)

        self.table.setVerticalHeader(QtWidgets.QHeaderView(QtCore.Qt.Vertical))

        self.layout().addWidget(self.title)
        self.layout().addStretch()
        self.layout().addWidget(self.table, 1)

    def _stage_table_widgets(self):
        self.table.setSizeAdjustPolicy(QtWidgets.QAbstractScrollArea.AdjustToContents)
        self.table.hide()

class GraphWidget(QtWidgets.QWidget):
    """
    Base class for other more complex widgets to inherit. An instance of `scrilla.gui.widgets.GraphWidget` embeds its child widgets in its own layout, which is an instance of``PySide6.QtWidgetQVBoxLayout``. This class provides access to the following widgets: a ``PySide6.QtWidgets.QLabel`` for the title widget, an error message widget and a ``PySide6.QtWidgets.QTableWidget`` for results display. 

    The graph to be displayed should be stored in the `scrilla.settings.TEMP_DIR` directory before calling the `show_pixmap` method on this class. It will load the graph from file and convert it into a ``PySide6.QtGui.QPixMap``.

    Parameters
    ----------
    1. **tmp_graph_key**: ``str``
        The key of the file in the `scrilla.settings.TEMP_DIR` used to store the image of the graph.
    2. **widget_title**: ``str``
        Title applied to the label of the graph.

    Attributes
    ----------
    1. **tmp_graph_key**: ``str``
    2. **title**: ``PySide6.QtWidget.QLabel``
    3. **figure**: ``PySide6.QtWidget.QLabel``
    """
    def __init__(self, tmp_graph_key: str, widget_title: str ="Graph Results"):
        super().__init__()    
        self.tmp_graph_key = tmp_graph_key
        self._init_graph_widgets(widget_title)
        self._arrange_graph_widgets()
        self._stage_graph_widgets() 
    
    def _init_graph_widgets(self, widget_title):
        self.setLayout(QtWidgets.QVBoxLayout())
        self.title = QtWidgets.QLabel(widget_title)
        self.figure = QtWidgets.QLabel()

    def _arrange_graph_widgets(self):
        self.figure.setAlignment(QtCore.Qt.AlignHCenter)
        self.layout().addWidget(self.title)
        self.layout().addWidget(self.figure)
    
    def _stage_graph_widgets(self):
        self.figure.hide()

    def show_pixmap(self):
        self.figure.setPixmap(utilities.generate_pixmap_from_temp(self.width(), self.height(), self.tmp_graph_key))
        self.figure.show()

class CompositeWidget(QtWidgets.QWidget):
    """
    Constructor
    -----------
    1. **tmp_graph_key**: ``str``
    2. **widget_title**: ``str``
        Title of the widget. Passed to the super class `scrilla.gui.widgets.SymbolWidget`.
    3. **table_title**: ``str``
    4. **graph_title**: ``str``

    Attributes
    ----------
    1. **title**: ``PySide6.QtWidgets.QLabel``
    2. **table**: ``scrilla.gui.widgets.TableWidget``
    3. **graph**: ``scrilla.gui.widgets.GraphWidget``
    4. **result_pane**: ``PySide6.QtWidget.QWidget``

    """
    def __init__(self, tmp_graph_key: str, widget_title: str="Results", table_title: str="Table Results", graph_title: str="Graph Results"):
        super().__init__()
        self._init_composite_widgets()
        self._arrange_composite_widgets(widget_title=widget_title,
                                        tmp_graph_key=tmp_graph_key, 
                                        graph_title=graph_title, 
                                        table_title=table_title)

    def _init_composite_widgets(self, widget_title, tmp_graph_key, graph_title, table_title):
        """Creates child widgets and their layouts"""
        # TODO: tabs for graph and table, tab text set to title...
        self.title = QtWidgets.QLabel(widget_title)
        self.table = TableWidget(table_title)
        self.graph = GraphWidget(tmp_graph_key, graph_title)
        self.result_pane = QtWidgets.QWidget()
        self.result_pane.setLayout(QtWidgets.QHBoxLayout())
        self.setLayout(QtWidgets.QVBoxLayout())
        
    def _arrange_composite_widgets(self):
        self.result_pane.layout().addWidget(self.table)
        self.result_pane.layout().addWidget(self.graph)
        
        self.layout().addWidget(self.title)
        self.layout().addWidget(self.result_pane)
