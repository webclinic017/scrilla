\begin_document
\begin_header
\save_transient_properties true
\origin unavailable
\textclass article
\use_default_options true
\maintain_unincluded_children false
\language english
\language_package default
\inputencoding auto
\fontencoding global
\font_roman "default" "default"
\font_sans "default" "default"
\font_typewriter "default" "default"
\font_math "auto" "auto"
\font_default_family default
\use_non_tex_fonts false
\font_sc false
\font_osf false
\font_sf_scale 100 100
\font_tt_scale 100 100
\use_microtype false
\use_dash_ligatures true
\graphics default
\default_output_format default
\output_sync 0
\bibtex_command default
\index_command default
\paperfontsize default
\use_hyperref false
\papersize default
\use_geometry false
\use_package amsmath 1
\use_package amssymb 1
\use_package cancel 1
\use_package esint 1
\use_package mathdots 1
\use_package mathtools 1
\use_package mhchem 1
\use_package stackrel 1
\use_package stmaryrd 1
\use_package undertilde 1
\cite_engine basic
\cite_engine_type default
\use_bibtopic false
\use_indices false
\paperorientation portrait
\suppress_date false
\justification true
\use_refstyle 1
\use_minted 0
\index Index
\shortcut idx
\color #008000
\end_index
\secnumdepth 3
\tocdepth 3
\paragraph_separation indent
\paragraph_indentation default
\is_math_indent 0
\math_numbering_side default
\quotes_style english
\dynamic_quotes 0
\papercolumns 1
\papersides 1
\paperpagestyle default
\tracking_changes false
\output_changes false
\html_math_output 0
\html_css_as_file 0
\html_be_strict false
\end_header

\begin_body

\begin_layout Standard

\size large
Recursive Estimation of Rolling Sample Statistics
\end_layout

\begin_layout Standard

\size tiny
Let a rolling sample of data of fixed length
\emph on
 n 
\emph default
be defined as a sample of data that gains one new observation and loses
 its oldest observation every time period.
 In other words, the sample of data is generated by taking successive sequences
 of a fixed length from a time series.
 
\end_layout

\begin_layout Standard

\size tiny
Rather than manually computing the sample statistics for each successive
 rolling sample of data, the computation time can be greatly decreased by
 developing recursion formulas that express the next value of a sample statistic
 in terms of its previous value, the observation gained and the observation
 lost.
 In the following section, recursion formulas for the sample mean, the sample
 variance and the sample covariance will be developed.
 
\end_layout

\begin_layout Standard
Sample Mean
\end_layout

\begin_layout Standard
Sample Variance
\end_layout

\begin_layout Standard
Sample Covariance
\end_layout

\begin_layout Standard

\size tiny
The covariance at time 
\begin_inset Formula $t_{o}$
\end_inset

of a sample 
\begin_inset Formula $\left\{ x_{i},y_{i}\right\} $
\end_inset

where 
\begin_inset Formula $i=0,1,\ldots,n-1$
\end_inset

can be calculated using the following formula,
\end_layout

\begin_layout Standard

\size footnotesize
\begin_inset Formula $\mathcal{\mathtt{Cov(\mathrm{x,y,t_{0})}}}=\frac{n}{n-1}\cdot\left[\frac{\mathop{\sum_{i=0}^{n-1}x_{i}\cdot y_{i}}}{n}-\overline{x_{t_{o}}}\cdot\overline{y_{t_{o}}}\right]$
\end_inset


\end_layout

\begin_layout Standard

\size tiny
where 
\begin_inset Formula $\overline{x_{t_{0}}}$
\end_inset

is the sample mean of x at 
\begin_inset Formula $t_{o}$
\end_inset

 and 
\begin_inset Formula $\overline{y_{t_{0}}}$
\end_inset

is the sample mean of y at 
\begin_inset Formula $t_{o}.$
\end_inset

 Likewise, the covariance at time 
\begin_inset Formula $t_{1}$
\end_inset

of a sample 
\begin_inset Formula $\left\{ x_{i},y_{i}\right\} $
\end_inset

where 
\begin_inset Formula $i=1,\ldots,n$
\end_inset

can be calculated,
\end_layout

\begin_layout Standard

\size footnotesize
\begin_inset Formula $\mathcal{\mathtt{Cov(\mathrm{x,y,t_{1})}}}=\frac{n}{n-1}\cdot\left[\frac{\mathop{\sum_{i=1}^{n}x_{i}\cdot y_{i}}}{n}-\overline{x_{t_{1}}}\cdot\overline{y_{t_{1}}}\right]$
\end_inset


\end_layout

\begin_layout Standard

\size tiny
Proceeding in the usual manner for analyzing series, the difference 
\begin_inset Formula $\Delta$
\end_inset

can be calculated.
 The difference of the summations is a telescoping series that leaves only
 the 
\begin_inset Formula $n^{th}$
\end_inset

and 
\begin_inset Formula $0^{th}$
\end_inset

terms.
 This observation leaves us with,
\end_layout

\begin_layout Standard

\size footnotesize
\begin_inset Formula $\triangle\mathtt{Cov(\mathrm{\mathrm{x,}y,t_{0},t_{1})=\frac{n}{n-1}\left[\frac{x_{n}\cdot y_{n}-x_{0}\cdot y_{0}}{n}+\overline{x_{t_{o}}}\cdot\overline{y_{t_{o}}}-\overline{x_{t_{1}}}\cdot\overline{y_{t_{1}}}\right]}}$
\end_inset


\end_layout

\begin_layout Standard

\size tiny
Using the results from the previous sections, the means at time 
\begin_inset Formula $t_{1}$
\end_inset

can recursively expressed in terms of their previous values,
\end_layout

\begin_layout Standard

\size footnotesize
\begin_inset Formula $\triangle\mathtt{Cov(\mathrm{\mathrm{x,}y,t_{0},t_{1})=\frac{n}{n-1}\left[\frac{x_{n}\cdot y_{n}-x_{0}\cdot y_{0}}{n}+\overline{x_{t_{o}}}\cdot\overline{y_{t_{o}}}-\left(\overline{x_{t_{o}}}+\frac{x_{n}-x_{0}}{n}\right)\cdot\left(\overline{y_{t_{0}}}+\frac{y_{n}-y_{0}}{n}\right)\right]}}$
\end_inset


\end_layout

\begin_layout Standard

\size tiny
Expanding the products inside of the brackets and simplifying the expression
 with some algebra magic, the following recursion relation emerges,
\end_layout

\begin_layout Standard

\size footnotesize
\begin_inset Formula $\triangle\mathtt{Cov(\mathrm{\mathrm{x,}y,t_{0},t_{1})=\frac{1}{n\cdot(n-1)}\left[y_{n}\cdot\left[\left(n-1\right)\cdot x_{n}+x_{0}\right]+y_{0}\cdot\left[x_{n}-\left(n-1\right)\cdot x_{0}\right]-\overline{x_{t_{0}}}\cdot\left(y_{n}-y_{0}\right)-\overline{y_{t_{0}}}\cdot\left(x_{n+1}-x_{0}\right)\right]}}$
\end_inset


\end_layout

\end_body
\end_document