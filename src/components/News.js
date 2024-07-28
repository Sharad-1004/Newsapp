import React, { Component } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    };
  }

  async componentDidMount() {
    this.fetchArticles(this.state.page);
  }

  fetchArticles = async (page) => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c54744e64e224526aafa57193d488f0d&page=${page}&pageSize=${this.props.pageSize}`;
      this.setState({ loading: true });
      const data = await fetch(url);
      const parsedData = await data.json();
      console.log(parsedData);
      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
      this.setState({ loading: false });
    }
  }

  handlePrevClick = async () => {
    console.log("previous");
    this.setState({ page: this.state.page - 1 }, () => {
      this.fetchArticles(this.state.page);
    });
  }

  handleNextClick = async () => {
    console.log("next");
    if (this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)) {
      // Do nothing or display a message
    } else {
      this.setState({ page: this.state.page + 1 }, () => {
        this.fetchArticles(this.state.page);
      });
    }
  }

  render() {
    return (
      <div className='container my-3'>
        <h1 className="text-center">NewsMonkey - Top Headlines</h1>

        {this.state.loading && <div>Loading...</div>}
        <div className="row">
          {this.state.articles.length > 0 ? (
            this.state.articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                />
              </div>
            ))
          ) : (
            !this.state.loading && <div>No articles found</div>
          )}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;

