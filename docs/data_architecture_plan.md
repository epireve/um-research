# Simplified Data Architecture Plan for Research Supervisor Matching

## Executive Summary

This document outlines a streamlined data architecture strategy for scaling the Research Supervisor Matching system from the Software Engineering department to the entire School of Computer Science. We propose transitioning from YAML files to a PostgreSQL database with vector search capabilities (pgvector) to enable semantic matching of research interests, independent topic updates, and improved scalability.

## Current Limitations

Our current YAML-based approach has several limitations:
- Limited semantic search capabilities for matching student interests
- No efficient way to update research topics independently
- Challenging to scale beyond a single department
- Difficult to implement advanced search features

## Simplified Architecture: PostgreSQL with pgvector

We recommend implementing a straightforward architecture using PostgreSQL with the pgvector extension:

### Why PostgreSQL with pgvector?

1. **Simplicity**: Single database system instead of multiple specialized databases
2. **Appropriate scale**: Well-suited for university-scale data (under 100K vectors)
3. **Cost-effective**: Self-hosted or affordable cloud options
4. **Familiar technology**: SQL-based queries and standard database operations
5. **Semantic search**: Vector similarity capabilities through pgvector
6. **Local deployment**: Can run entirely on local infrastructure
